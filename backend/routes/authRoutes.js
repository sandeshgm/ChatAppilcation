import express from "express";
import {
  userLogin,
  userRegister,
  userLogout,
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout", userLogout);

export default router;
