import express from "express";
import {
  LoginUser,
  myProfile,
  registerUser,
  verifyUser,
} from "../controllers/users.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyUser);
router.post("/login", LoginUser);
router.get("/myProfile", isAuth, myProfile);
export default router;
