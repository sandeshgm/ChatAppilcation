import express from "express";
const router = express.Router();
import { isLogin } from "../middleware/isLogin.js";
import { getUserBySearch, getCurrentChatters } from "../controllers/userControllers.js";

router.get("/search", isLogin, getUserBySearch);
router.get("/currentChatters", isLogin, getCurrentChatters);

export default router;
