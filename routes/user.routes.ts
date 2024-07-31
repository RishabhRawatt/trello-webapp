import { Router } from "express";
import {
  getCurrentUser,
  signinUser,
  signoutUser,
  signupUser,
} from "../controllers/user.controllers";
import { verifyJWT } from "../middleware/auth.middleware";
//jwt
//controller
const userRouter: Router = Router();

userRouter.route("/signup").post(signupUser);
userRouter.route("/signin").post(signinUser);
userRouter.route("/signout").post(verifyJWT, signoutUser);
userRouter.route("/me").post(verifyJWT, getCurrentUser);

export default userRouter;
