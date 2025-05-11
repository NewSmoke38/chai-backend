import { asyncHandler } from "../utils/asyncHandler.js";

//ye method hazaro baar likhna hai
// method toh bana diya, method run kab ho???, some url needs to be hit, routes come in picture
const registerUser = asyncHandler( async (req, res)) => {
    res.status(200).json({
        message: "ok"
    })
}


export (registerUser)