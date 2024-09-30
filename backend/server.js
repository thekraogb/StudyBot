import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import agentRoute from "./routes/agent.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.use(express.json()); // allows to accept incoming jason data

app.use("/api", agentRoute);

app.listen(PORT, () => {
  console.log("server is running at http://localhost:" + PORT);
});
