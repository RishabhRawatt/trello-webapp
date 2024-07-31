"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const task_controllers_1 = require("../controllers/task.controllers");
const taskRouter = (0, express_1.Router)();
//common middleware
taskRouter.use(auth_middleware_1.verifyJWT);
taskRouter.route("/").post(task_controllers_1.createTaskController);
taskRouter.route("/all").get(task_controllers_1.getMyAllTasksController);
taskRouter
    .route("/:taskId")
    .get(task_controllers_1.getTaskController)
    .put(task_controllers_1.updateTaskController)
    .delete(task_controllers_1.deleteTaskController);
exports.default = taskRouter;
