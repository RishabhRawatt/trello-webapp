import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import {
  createTaskController,
  deleteTaskController,
  getMyAllTasksController,
  getTaskController,
  updateTaskController,
} from "../controllers/task.controllers";

const taskRouter: Router = Router();

//common middleware
taskRouter.use(verifyJWT);

taskRouter.route("/").post(createTaskController);
taskRouter.route("/all").get(getMyAllTasksController);

taskRouter
  .route("/:taskId")
  .get(getTaskController)
  .put(updateTaskController)
  .delete(deleteTaskController);

export default taskRouter;
