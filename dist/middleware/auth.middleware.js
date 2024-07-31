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
exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AsyncHandler_1 = __importDefault(require("../utils/AsyncHandler"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const user_model_1 = __importDefault(require("../models/user.model"));
exports.verifyJWT = (0, AsyncHandler_1.default)((req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorizationHeader = req.header("Authorization");
        // const accessToken =
        // req.cookies?.accessToken ||
        // req.header("Authorization")?.replace("Bearer ", "");
        const accessToken = authorizationHeader
            ? authorizationHeader.replace("Bearer ", "").trim()
            : null;
        if (!accessToken) {
            throw new ApiError_1.default(401, "Unauthorized request");
        }
        // Verify and decode the token
        const decodedToken = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        // Fetch user from database
        const user = yield user_model_1.default.findById(decodedToken._id).select("-password");
        if (!user) {
            throw new ApiError_1.default(401, "Invalid access token");
        }
        req.user = user;
        next();
    }
    catch (error) {
        throw new ApiError_1.default(401, (error === null || error === void 0 ? void 0 : error.message) || "Invalid access token");
    }
}));
