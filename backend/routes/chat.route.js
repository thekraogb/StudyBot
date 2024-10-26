import express from "express";
import {verifyJWT} from "../middleware/verifyjwt.js";

import {
    createChat,
    getChats,
    deleteChat,
  } from "../controllers/chat.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/", createChat);
router.get("/", getChats);
router.delete("/:chatId", deleteChat);


export default router;