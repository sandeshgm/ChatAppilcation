import dotenv from "dotenv";
import express from "express";
import dbConnect from "./DB/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messagesRoutes.js";
import userRouters from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 3003;

//database connections
dbConnect();

//middleware
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRouters);


app.get("/", (req, res) => {
  res.send("Server is working");
});

app.listen(PORT, () => {
  console.log(`Listening at ${PORT} `);
});
