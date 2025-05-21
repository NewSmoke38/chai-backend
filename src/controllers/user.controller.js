import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens = async (userId) => {
   try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()     // use correct method name
      const refreshToken = user.generateRefreshToken()   // use correct method name

      user.refreshToken = refreshToken
      user.save({ validateBeforeSave: false })

      return { accessToken, refreshToken }

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
   const { fullName, email, username, password } = req.body
   console.log("email: ", email);


   // validation that its not coming empty for multiple things at a time
   if (
      [fullName, email, username, password].some((field) =>
         field?.trim() === "")            // some means agar kisi bhi field ko trim krne ke baad(trimming the whitespace) "" se equal hojata hai that means it will show error
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

   if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required")
   }

   let coverImageLocalPath;
   if (req.files && Array.isArray(req.files            // files hai ya nhi, then wo array hai ya nhi, then uski length 0 se zayada hai ya nhi
      .coverImage) && req.files.coverImage.length > 0) {

      coverImageLocalPath = req.files.coverImage[0].path       // agar hai toh uske 0th element(yaani ki wahi) me se path nikal lo

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

const loginUser = asyncHandler(async (req, res) => {

   // take username, pass
   const { email, username, password } = req.body;

   if (!(username || email)) {
      throw new ApiError(400, "username or password is required");
   }

   const user = await User.findOne({ $or: [{ username }, { email }] });

   if (!user) {
      throw new ApiError(404, "user does not exist");
   }

   const isPasswordValid = await user.isPasswordCorrect(password);

   if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
   }

   const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
      user._id
   );

   const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );

   const options = {
      httpOnly: true,
      secure: true
   };

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
         new ApiResponse(
            200,
            { user: loggedInUser, accessToken, refreshToken },
            "User logged In Successfully"
         )
      );
});



// logout user

const logoutUser = asyncHandler(async (req, res) => {
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
   return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"))

})

// now for cookies
const options = {
   httpOnly: true,
   secure: true
}


// user will send refresh token to get another access token w/o logging in for multiple times
const refreshAccessToken = asyncHandler(async (req, res) => {
   const incoming = req.cookie.refreshToken || req.body.refreshToken

   if (incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request")
   }
      // user ke bheje hue refresh Token ko decode krlenge

try {
      const deodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
      )
      const user = await user.findById(decodedToken?._id)
   
         if (!user) {
         throw new ApiError(401, "Invalid Refresh Token")
      }
      // refresh token sent by user must match the refresh token in our database
       if (incomingRefreshToken !== user?.refreshtoken) {
         throw new ApiError(401, "Refresh token is expired or used")
       }
      // if matches then generate a new refresh token for that user
       const options = {
         httpOnly: true,
         secure: true
       }
       const {accessToken, newRefreshToken} = await
        generateAccessAndRefreshTokens(user._id)
   
       return res
       .status(200)
       .cookie("accessToken", accessToken, options)
       .cookie("refreshToken", accessToken, options)
       .json(
         new ApiResponse(
            200,
            {accessToken, refreshToken: newRefreshToken},
            "Access token refreshed successfully"
   
         )
       )
   
} catch (error) {
   throw new ApiError(401, error?.message || 
      "Invalid refresh token")
}}) 

export {
   registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken
};