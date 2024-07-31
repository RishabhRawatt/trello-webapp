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
exports.getMyAllTasksController = exports.getTaskController = exports.deleteTaskController = exports.updateTaskController = exports.createTaskController = void 0;
const AsyncHandler_1 = __importDefault(require("../utils/AsyncHandler"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const task_model_1 = __importDefault(require("../models/task.model"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const createTaskController = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, status, priority, deadline } = req.body;
    const user = req.user;
    if (!user)
        throw new ApiError_1.default(401, "Unauthorized");
    if (!title || !status) {
        throw new ApiError_1.default(400, "Title and Status are required");
    }
    if ([title, status].some((field) => field.trim() === ""))
        throw new ApiError_1.default(400, "Title and Status are required");
    const task = yield task_model_1.default.create({
        title,
        description: description || "",
        status,
        priority: priority || "Low",
        deadline: deadline || null,
        user: user._id,
    });
    if (!task) {
        throw new ApiError_1.default(500, "Failed to create new Task");
    }
    return res
        .status(201)
        .json(new ApiResponse_1.default(201, task, "Task created successfully"));
}));
exports.createTaskController = createTaskController;
const updateTaskController = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const { title, description, status, priority, deadline } = req.body;
    const user = req.user;
    if (!user)
        throw new ApiError_1.default(401, "Unauthorized");
    if (!taskId)
        throw new ApiError_1.default(400, "Task ID is required");
    const task = yield task_model_1.default.findById(taskId);
    if (!task)
        throw new ApiError_1.default(404, "Task not found");
    if (task.user.toString() !== user._id.toString()) {
        throw new ApiError_1.default(403, "Only task owner can edit their tasks");
    }
    const updateData = {
        title: title !== undefined ? title : task.title,
        description: description !== undefined ? description : task.description,
        status: status !== undefined ? status : task.status,
        priority: priority !== undefined ? priority : task.priority,
        deadline: deadline !== undefined ? deadline : task.deadline,
    };
    const updatedTask = yield task_model_1.default.findByIdAndUpdate(task._id, updateData, {
        new: true,
    });
    if (!updatedTask) {
        throw new ApiError_1.default(500, "Failed to update task.");
    }
    return res
        .status(200)
        .json(new ApiResponse_1.default(200, updatedTask, "Task updated successfully"));
}));
exports.updateTaskController = updateTaskController;
const deleteTaskController = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const user = req.user;
    if (!user)
        throw new ApiError_1.default(401, "Unauthorized");
    if (!taskId)
        throw new ApiError_1.default(400, "Task ID is required");
    const task = yield task_model_1.default.findById(taskId);
    if (!task)
        throw new ApiError_1.default(404, "Task not found");
    if (task.user.toString() !== user._id.toString()) {
        throw new ApiError_1.default(403, "Only task owner can delete their tasks");
    }
    const deletedTask = yield task_model_1.default.findOneAndDelete({
        _id: taskId,
        user: user._id,
    });
    if (!deletedTask) {
        throw new ApiError_1.default(404, "Task not found");
    }
    return res
        .status(200)
        .json(new ApiResponse_1.default(200, {}, "Task deleted successfully"));
}));
exports.deleteTaskController = deleteTaskController;
const getTaskController = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const user = req.user;
    if (!user) {
        throw new ApiError_1.default(401, "Unauthorized");
    }
    if (!taskId) {
        throw new ApiError_1.default(400, "Task ID is required.");
    }
    const task = yield task_model_1.default.findOne({ _id: taskId, user: user._id });
    if (!task) {
        throw new ApiError_1.default(404, "Task not found");
    }
    return res
        .status(200)
        .json(new ApiResponse_1.default(200, task, "Task fetched successfully"));
}));
exports.getTaskController = getTaskController;
const getMyAllTasksController = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        throw new ApiError_1.default(401, "Unauthorized");
    const tasks = yield task_model_1.default.find({ user: user._id });
    if (!tasks)
        throw new ApiError_1.default(404, "No tasks found");
    return res
        .status(200)
        .json(new ApiResponse_1.default(200, tasks, "All tasks fetched successfully"));
}));
exports.getMyAllTasksController = getMyAllTasksController;
