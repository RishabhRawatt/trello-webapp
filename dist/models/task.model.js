"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ["To do", "In Progress", "Under Review", "Finished"],
        default: "To do",
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "Urgent"],
        default: "Low",
    },
    deadline: {
        type: Date,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
const Task = (0, mongoose_1.model)("Task", taskSchema);
exports.default = Task;
