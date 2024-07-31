import { Request, Response } from "express";
import { Types } from "mongoose";
import AsyncHandler from "../utils/AsyncHandler";
import ApiError from "../utils/ApiError";
import Task from "../models/task.model";
import ApiResponse from "../utils/ApiResponse";

interface User {
  _id: Types.ObjectId;
}

interface CreatetaskRequest extends Request {
  body: {
    title: string;
    description?: string;
    status: "To do" | "In Progress" | "Under Review" | "Finished";
    priority?: "Low" | "Medium" | "Urgent";
    deadline?: Date | null;
  };
  user?: User;
}

interface UpdateTaskRequest extends Request {
  body: {
    title?: string;
    description?: string;
    status?: "To-Do" | "In Progress" | "Under Review" | "Completed";
    priority?: "Low" | "Medium" | "Urgent";
    deadline?: Date | null;
  };
  // params: {
  //   taskId: string;
  // };
  user?: User;
}

interface DeleteTaskRequest extends Request {
  user?: User;
}

interface GetTaskRequest extends Request {
  user?: User;
}

interface GetAllTasksRequest extends Request {
  user?: User;
}

const createTaskController = AsyncHandler(
  async (req: CreatetaskRequest, res: Response) => {
    const { title, description, status, priority, deadline } = req.body;
    const user = req.user;

    if (!user) throw new ApiError(401, "Unauthorized");

    if (!title || !status) {
      throw new ApiError(400, "Title and Status are required");
    }

    if ([title, status].some((field) => field.trim() === ""))
      throw new ApiError(400, "Title and Status are required");

    const task = await Task.create({
      title,
      description: description || "",
      status,
      priority: priority || "Low",
      deadline: deadline || null,
      user: user._id,
    });

    if (!task) {
      throw new ApiError(500, "Failed to create new Task");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, task, "Task created successfully"));
  }
);

const updateTaskController = AsyncHandler(
  async (req: UpdateTaskRequest, res: Response) => {
    const { taskId } = req.params;
    const { title, description, status, priority, deadline } = req.body;
    const user = req.user;

    if (!user) throw new ApiError(401, "Unauthorized");

    if (!taskId) throw new ApiError(400, "Task ID is required");

    const task = await Task.findById(taskId);

    if (!task) throw new ApiError(404, "Task not found");

    if (task.user.toString() !== user._id.toString()) {
      throw new ApiError(403, "Only task owner can edit their tasks");
    }

    const updateData = {
      title: title !== undefined ? title : task.title,
      description: description !== undefined ? description : task.description,
      status: status !== undefined ? status : task.status,
      priority: priority !== undefined ? priority : task.priority,
      deadline: deadline !== undefined ? deadline : task.deadline,
    };

    const updatedTask = await Task.findByIdAndUpdate(task._id, updateData, {
      new: true,
    });

    if (!updatedTask) {
      throw new ApiError(500, "Failed to update task.");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
  }
);

const deleteTaskController = AsyncHandler(
  async (req: DeleteTaskRequest, res: Response) => {
    const { taskId } = req.params;
    const user = req.user;

    if (!user) throw new ApiError(401, "Unauthorized");

    if (!taskId) throw new ApiError(400, "Task ID is required");

    const task = await Task.findById(taskId);

    if (!task) throw new ApiError(404, "Task not found");

    if (task.user.toString() !== user._id.toString()) {
      throw new ApiError(403, "Only task owner can delete their tasks");
    }

    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      user: user._id,
    });

    if (!deletedTask) {
      throw new ApiError(404, "Task not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Task deleted successfully"));
  }
);

const getTaskController = AsyncHandler(
  async (req: GetTaskRequest, res: Response) => {
    const { taskId } = req.params;
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!taskId) {
      throw new ApiError(400, "Task ID is required.");
    }

    const task = await Task.findOne({ _id: taskId, user: user._id });

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, task, "Task fetched successfully"));
  }
);

const getMyAllTasksController = AsyncHandler(
  async (req: GetAllTasksRequest, res: Response) => {
    const user = req.user;

    if (!user) throw new ApiError(401, "Unauthorized");

    const tasks = await Task.find({ user: user._id });

    if (!tasks) throw new ApiError(404, "No tasks found");

    return res
      .status(200)
      .json(new ApiResponse(200, tasks, "All tasks fetched successfully"));
  }
);

export {
  createTaskController,
  updateTaskController,
  deleteTaskController,
  getTaskController,
  getMyAllTasksController,
};
