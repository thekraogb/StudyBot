import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import agentRoute from "./routes/agent.route.js";
import messageRoute from "./routes/message.route.js";
import chatRoute from "./routes/chat.route.js";
import userRoute from "./routes/user.route.js"; 
import { corsOptions } from "./config/cors.js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors(corsOptions));

app.use(express.json()); 

app.use(cookieParser())

app.use("/agent", agentRoute);
app.use("/message", messageRoute);
app.use("/chat", chatRoute);
app.use("/user", userRoute);
app.use("/auth", authRoute);

app.listen(PORT, () => {
  connectDB();
  console.log("server is running at http://localhost:" + PORT);
});
