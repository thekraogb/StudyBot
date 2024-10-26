import express from "express";

import {
    loginUser,
    refresh,
    logoutUser
  } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", loginUser)
router.get("/refresh", refresh)
router.post("/logout", logoutUser)


export default router;