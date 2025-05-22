import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
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

    // secured routes
    router.route("/logout").post(verifyJWT, logoutUser)
    router.route("/refresh-token").post(refreshAccessToken)





export default router