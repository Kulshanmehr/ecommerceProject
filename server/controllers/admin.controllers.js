import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/courses.models.js";
import { Lecture } from "../models/lecture.models.js";
export const createCourse = TryCatch(async (req, res) => {
  const { title, description, category, createdBy, price, duration } = req.body;
  const image = req.file;
  await Courses.create({
    title,
    description,
    category,
    image: image?.path,
    duration,
    price,
  });
  res.status(201).json({
    message: "Course Created Successfully",
  });
});

export const AddLecture = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  if (!course) {
    return res.status(400).json({
      message: "No Course is availble for this Id",
    });
  }
  const { title, desription } = req.body;
  const file = req.file;
  const lecture = await Lecture.create({
    title,
    description,
    video: file?.path,
    course: course._id,
  });

  res.status(201).json({
    message: "Lecture Has been Added Successfully",
    lecture,
  });
});
