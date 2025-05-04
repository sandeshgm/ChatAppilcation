import express from "express";
const router = express.Router();
import { isLogin } from "../middleware/isLogin.js";
import {
  getUserBySearch,
  getCurrentChatters,
  savePublicKey,
} from "../controllers/userControllers.js";

router.get("/search", isLogin, getUserBySearch);
router.get("/currentChatters", isLogin, getCurrentChatters);
router.put("/public-key", isLogin, savePublicKey);

export default router;
