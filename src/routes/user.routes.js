import { Router } from "express";
import { registerUser } from "../controller/user.controller.js"
// router banana hota hai
const router = Router()

router.route("/register").post(registerUser)   // yaha se method se regiter user aajyega

export default router