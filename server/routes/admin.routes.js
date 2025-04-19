import express from "express";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import { AddLecture, createCourse } from "../controllers/admin.controllers.js";
import { uploadFile } from "../middlewares/multer.middleware.js";
import { deleteLecture } from "../controllers/courses.controllers.js";
const router = express.Router();

router.post("/courses/new", isAuth, isAdmin, uploadFile, createCourse);
router.post("/lecture/new", isAuth, isAdmin, uploadFile, AddLecture);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);

export default router;
