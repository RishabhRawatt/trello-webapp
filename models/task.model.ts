import { Schema, model, Document, Types, Model } from "mongoose";

interface ITask extends Document {
  title: string;
  description?: string;
  status: "To do" | "In Progress" | "Under Review" | "Finished";
  priority: "Low" | "Medium" | "Urgent";
  deadline?: Date | null;
  user: Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Task: Model<ITask> = model<ITask>("Task", taskSchema);

export default Task;
