import express from "express";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import { createCourse } from "../controllers/admin.controllers.js";
import { uploadFile } from "../middlewares/multer.middleware.js";
import {
  checkout,
  deleteCourse,
  fetchLecture,
  getAllCourses,
  getAllStats,
  getIndividualCourses,
  getMyCourses,
  getSingleCourseLectures,
  paymentVerification,
} from "../controllers/courses.controllers.js";
const router = express.Router();

router.get("/all", getAllCourses);
router.get("/:id", getIndividualCourses);
router.get("/lectures/:id", getSingleCourseLectures);
router.get("/lecture/:id", fetchLecture);
router.get("/course/:id", deleteCourse);
router.get("/stats", isAuth, isAdmin, getAllStats);
router.get("/mycourse", getMyCourses);
router.post("/checkout/:id", isAuth, checkout);
router.post("/verification/:id", isAuth, paymentVerification);

export default router;
