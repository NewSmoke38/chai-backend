import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

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
       field?.trim() === "" )
   ) {
        throw new ApiError(400, "All fields are required")
   }


   // checking is user already exists
   // ya toh ye email mil jaaye ya toh ye username mil jaaye, if match hojaye then user already exists
 const existedUser = User.findOne({
      $or: [{ username }, { email }]
   })

   if (existedUser) {
    throw new ApiError(409, "User w email or username already exists")
   }



   //check for any images or avatar coming from client
   // multer gave us files ka access

   const avatarLocalPath = req.files?.avatar[0]?.path       // mutler has already taken the file from client
    // kyunki we've told multer to put stuff from thier destination w original names
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

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
  User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  })


}) 

export { registerUser };