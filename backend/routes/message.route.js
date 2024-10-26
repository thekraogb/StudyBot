import express from "express";
import {verifyJWT} from "../middleware/verifyjwt.js";

import {
    createMessage,
    getMessages,
  } from "../controllers/message.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/", createMessage);
router.get("/:chatId", getMessages);

export default router;