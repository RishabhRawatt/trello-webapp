import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes";
import taskRouter from "./routes/task.routes";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true, limit: "5kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//to parser body
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

export default app;
