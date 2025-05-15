import { asyncHandler } from "../utils/asyncHandler";


export const verifyJWT = asyncHandler(async(req, res, 
    next) => {
       const token = req.cookies?.access || req.header
       ("Authorization")?.replace("Bearer", "")

       if (!token) {
          throw new ApiError
       }
})