import express from "express";

import {
  getAnswer,
  getQuestion,
  getsubtopic,
  getQuizFeedback,
  getQuizAnswer,
} from "../controllers/agent.controller.js";

const router = express.Router();

router.post("/answer", getAnswer);
router.post("/question", getQuestion);
router.post("/subtopic", getsubtopic);
router.post("/quizFeedback", getQuizFeedback);
router.post("/quizAnswer", getQuizAnswer);

export default router;
