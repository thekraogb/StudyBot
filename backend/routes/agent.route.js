import express from "express";

import {
  getAnswer,
  getQuestion,
  getsubtopic,
  getQuizFeedback,
  getQuizAnswer,
  getquizChoices,
  getQuizChoiceFeedback,
} from "../controllers/agent.controller.js";

const router = express.Router();

router.post("/answer", getAnswer);
router.post("/question", getQuestion);
router.post("/subtopic", getsubtopic);
router.post("/quizFeedback", getQuizFeedback);
router.post("/quizAnswer", getQuizAnswer);
router.post("/quizChoices", getquizChoices);
router.post("/quizChoiceFeedback", getQuizChoiceFeedback);

export default router;
