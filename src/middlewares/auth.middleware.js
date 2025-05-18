import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, _, 
    next) => {
try {
          const token = req.cookies?.access || req.header    // ya toh cookies se token niklega ya toh auth bearer sey=
          ("Authorization")?.replace("Bearer", "")   // bearer hata ke token mil jaayega
   
          if (!token) {
             throw new ApiError(401, "Unauthorized request")
          }
   
      // AGAR TOKEN MIL GYA
      // then check if it is valid or not
      const decodedToken = jwt.verify(token, process.env
         .ACCESS_TOKEN_SECRET)   // info like id username and all we gotta find
   
      const user =  await User.findById(decodedToken?._id).select
         ("-password refreshToken")
       
         if (!user) {
            throw new ApiError(401, "Invalid Access Token")
         }
   
   
       req.user = user;
       next()              /// middleware verifyJWT ka kaam hogaya so jump to next thingy
   
} catch (error) {
   throw new ApiError(401, "Invalid access  thrown")
}
})