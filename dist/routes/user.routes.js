"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const auth_middleware_1 = require("../middleware/auth.middleware");
//jwt
//controller
const userRouter = (0, express_1.Router)();
userRouter.route("/signup").post(user_controllers_1.signupUser);
userRouter.route("/signin").post(user_controllers_1.signinUser);
userRouter.route("/signout").post(auth_middleware_1.verifyJWT, user_controllers_1.signoutUser);
userRouter.route("/me").post(auth_middleware_1.verifyJWT, user_controllers_1.getCurrentUser);
exports.default = userRouter;
