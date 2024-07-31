"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.signoutUser = exports.signinUser = exports.signupUser = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const AsyncHandler_1 = __importDefault(require("../utils/AsyncHandler"));
const user_model_1 = __importDefault(require("../models/user.model"));
const signupUser = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password } = req.body;
    if ([fullName, email, password].some((field) => field.trim() === "")) {
        throw new ApiError_1.default(400, "All fields are required");
    }
    const userExists = yield user_model_1.default.findOne({ email });
    if (userExists) {
        throw new ApiError_1.default(409, "User with this email already exists");
    }
    const user = yield user_model_1.default.create({
        fullName,
        email,
        password,
    });
    const createdUser = yield user_model_1.default.findById(user._id).select("-password");
    if (!createdUser) {
        throw new ApiError_1.default(500, "User registration failed, please try again");
    }
    return res
        .status(201)
        .json(new ApiResponse_1.default(201, createdUser, "User registered successfully!!!"));
}));
exports.signupUser = signupUser;
const signinUser = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError_1.default(400, "All fields are required");
    }
    if ([email, password].some((field) => field.trim() === "")) {
        throw new ApiError_1.default(400, "All fields are required");
    }
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new ApiError_1.default(404, "User not found. Try to register first");
    }
    const isPasswordValid = yield user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError_1.default(401, "Invalid email or password");
    }
    //access token
    const accessToken = yield user.generateAccessToken();
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse_1.default(200, { accessToken }, "User logged in successfully"));
}));
exports.signinUser = signinUser;
const signoutUser = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        httpOnly: true,
        secure: true,
    };
    res.clearCookie("accessToken", options);
    return res
        .status(200)
        .json(new ApiResponse_1.default(200, {}, "User logged out successfully"));
}));
exports.signoutUser = signoutUser;
const getCurrentUser = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res
        .status(200)
        .json(new ApiResponse_1.default(200, req.user, "current user fetched successfully"));
}));
exports.getCurrentUser = getCurrentUser;
