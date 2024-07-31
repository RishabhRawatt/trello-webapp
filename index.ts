import connectDB from "./db";
import app from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.SERVER_PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.SERVER_PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
