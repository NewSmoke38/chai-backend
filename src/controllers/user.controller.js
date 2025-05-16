import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async(userId) => {
   try {
      const user = await User.findById(userId)
      const accessToken = user.genrateAccessToken()     // ye methods hai
      const refreshToken = user.generateRefreshToken()  // ye methods hai
   
      user.refreshToken = refreshToken           // ab ye refresh tokens save rhenge db me so user ko baar baar passwords na daalna pade
      user.save({validateBeforeSave: false})

      return {accessToken, refreshToken}

   } catch (error) {
      throw new ApiError(500, "Something went wrong will generating refresh and access token")
   }
}



//ye method hazaro baar likhna hai
// method toh bana diya, method run kab ho???, some url needs to be hit, routes come in picture

// registering a user
const registerUser = asyncHandler(async (req, res) => {
   // get user details from frontend 
   // validation, not empty name? wrong email structure toh nhi bhej diya - {routes me hi check krna hai}
   // check if user already exist: username, email
   // check for images, check for avatar
   // upload them to cloudinary, check avatar if it is there or not
   // create user object - create entry in db 
   // remove password and refresh token field from response as they are encrypted now
   // check for user creation
   // then return response or if no then send error in response
   


  // take user detail
   const {fullName, email, username, password } = req.body  
   console.log("email: ", email);


  // validation that its not coming empty for multiple things at a time
   if (
         [fullName, email, username, password].some((field) => 
       field?.trim() === "" )            // some means agar kisi bhi field ko trim krne ke baad(trimming the whitespace) "" se equal hojata hai that means it will show error
   ) {
        throw new ApiError(400, "All fields are required")
   }


   // checking is user already exists
   // ya toh ye email mil jaaye ya toh ye username mil jaaye, if match hojaye then user already exists
 const existedUser = await User.findOne({
      $or: [{ username }, { email }]        // user selection me we find at least one of them if match then
   })

   if (existedUser) {
    throw new ApiError(409, "User w email or username already exists")
   }



   //check for any images or avatar coming from client
   // multer gave us files ka access
   
   
   const avatarLocalPath = req.files?.avatar[0]?.path;      // mutler has already taken the file from client
    // kyunki we've told multer to put stuff from thier destination w original names
   //const coverImageLocalPath = req.files?.coverImage[0]?.path;
   //console.log((req.files));

   let coverImageLocalPath;
   if (req.files && Array.isArray(req.files            // files hai ya nhi, then wo array hai ya nhi, then uski length 0 se zayada hai ya nhi
   .coverImage) && req.files.coverImage.length > 0) {

      coverImageLocalPath = req.files.coverImage[0].path       // agar hai toh uske 0th element(yaani ki wahi) me se path nikal lo

   }


   if (!avatarLocalPath) {
         throw new ApiError(400, "Avatar file is required")
   }

   


   // uploading to cloudinary

   // await so that it doesnt go so fast w/o uploading fully and accsing further code
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   // check if there is a avatar or not?
      if (!avatar) {
         throw new ApiError(400, "Avatar file is required")
   }

  // db me entry krwado user ki, make a user object there
  // db se baat krne me errors aajate hai, so async will handle it, so we must await kyunki bhai time to lagega hi
 const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,             // as it is 
    username: username.toLowerCase()  // should be in lowercase 
  })
  
 
  // check if user object created
  // and remove refresh token from response
  const createdUser = await User.findById(user._id).select(        // _id hrr user ke saath khud hi lag jata hai
      "-password -refreshToken"  // ham wo minus karenge jo hame response me nhi dena hai user ko, cause every thing will go if we wont sepcify
  )

  if (!createdUser) {
     throw new ApiError(500, "SOmething went wron while registering the user")
  }
  

  // return response
  return res.status(201).json(
   new ApiResponse(200, createdUser, "User registered successfully!!")
  )



}) 


// login w tokens
const loginUser = asyncHndler(async (req, res) => {
   
   // steps
   // req body se -> data le aao
   // username or email, dono pe se kisi ek ke base pe ya kisi ke bhi base pe login karana hai
   // find the user
   // if user is already registeered then password check
   // access and referesh tokne generate and give to user
   // send to user in form of cookies



   // take data from req body
   const {email, username, password} = req.body
 

  // login o any base like username or email

   
  
  
  
  
  
  
  
  
  
  if (!username || !email) {             // koi ek toh dedo bhai
      throw new ApiError(400, "Username or Password is required")
   }

  // check if user already exists or not, to make login

  const user = await User.findOne({       // hamne user bana liya
   $or: [{username}, {email}]            // dono me sekoi bhi ek mil jaaye
  })                                     // $or   is one of the operators of MongoDB to check for or

  if (!user) {
   throw new ApiError(404, "User does not exist")
  }




///// User and user me difference is

//// User (Capital U)is a mongoose model (class/blueprint)
//// user(small u) is the user we have made 
//// You’re saying:

/// “Using the User model, search MongoDB for a document. When you find it, call that thing user.”



   // hamne hamare iss user ko user maana hai AKA the result we got from mongoDB

  // agar user mil gya, then check password
  // toh ab jo user maan liya hai toh usko hi rkh ke uska password check krenge
 const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
   throw new ApiError(401, "Invalid user credentials")
  }   

  

  // make access + refresh token
  // call this method
  const {accessToken, refreshToken} = await 
  generateAccessAndRefreshTokens(user._id)

  // firse db ko hi call kr dia
  const loggesInUser = await User.findById(user._id).
  select("-password -refreshToken")


    // send in cookies to user
    const options = {              // only backend can modify
      httpOnly: true,                // not frontend
      secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options.cookie)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
         200,
         {
            user: loggedInUser, accessToken,
            refreshToken
         },
         "User logged in Successfully"
      )
    )
   })




// logout user

const logoutUser = asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate(
      req.user._id,
      {
         $set: {
            refreshToken: undefined      // refresh token toh gayab
         }
      },
      {
         new: true
      }
   )
})

// now for cookies
const options = {
   httpOnly: true,
   secure: true
}

   return res
     .status(200)
     .clearCookies("accessToken", options)
     .clearCookies("refreshToken", options)
     .json(new ApiResponse(200, {}, "User logged out successfully"))












export {  
   registerUser,
   loginUser,
   logoutUser
 };