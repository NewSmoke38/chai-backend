import { Router } from "express";
import { 
    changeCurrentPassword, 
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    loginUser,
    logoutUser,
    refreshAccessToken, 
    registerUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserCoverImage 
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
// router banana hota hai
const router = Router()


// user register krna hai, file handling ki bhai empty to nhi hai 
router.route("/register").post(
    upload.fields([                // middleware injected
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)  // yaha se method se regiter user aajyega

    router.route("/login").post(loginUser)


    // user koi data send kr rha hai toh post use karle
    
// secured routes
router.route("/logout").post(verifyJWT, logoutUser) 

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPassword) // injecting verifyJWT so that only logges in users can change thier passwords

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)   // patch used as we only want some of the data to be changed not all of it

router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)   // yaha pr url ki baat hogyi

router.route("/cover-image").patch(verifyJWT, upload.single("/coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)     //because params is used there

router.route("/history").get(verifyJWT, getWatchHistory)


export default router