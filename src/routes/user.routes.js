import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
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
            name: coverImage,
            maxCount: 1
        }
    ]),
    registerUser)  // yaha se method se regiter user aajyega

export default router