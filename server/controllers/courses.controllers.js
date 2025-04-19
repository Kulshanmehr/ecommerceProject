import { Courses } from "../models/courses.models.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Lecture } from "../models/lecture.models.js";
import { User } from "../models/user.models.js";
import { promisify } from "util";
import fs, { rm } from "fs";
import { instance } from "../index.js";
import { Payment } from "../models/payment.models.js";
export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  res.json({
    courses,
  });
});

export const getIndividualCourses = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  if (!course) {
    req.json({
      course,
    });
  }
});

export const getSingleCourseLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });

  const user = await User.findById(req.user._id);
  if (user.role === "admin") {
    return res.json({ lectures });
  }
  if (!user.subscription.includes(req.params.id)) {
    return res.status(400).json({
      message: "You have not subscibed to this course",
    });
  }
  res.json({ lectures });
});

export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    res.json({ lecture });
  }
  if (!user.subscription.includes(req.params.id)) {
    return res.status(400).json({
      message: "You have not subscibed to this course",
    });
  }
  res.json({ lecture });
});

export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  rm(lecture.video, () => {
    console.log("Lecture Deleted");
  });
  await lecture.deleteOne();
  res.json({
    message: "Lecture Deleted",
  });
});

const unlinkAsync = promisify(fs.unlink);

export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  const lectures = await Lecture.find({ course: course._id });

  await Promise.all(
    lectures.map(async (lecture) => {
      await unlinkAsync(lecture.video);
      console.log("video Deleted");
    })
  );

  rm(course.image, () => {
    console.log("Image Deleted");
  });
  await Lecture.find({ course: req.params.id }).deleteMany();
  await Courses.deleteOne();
  await User.updateMany({}, { $pull: { subscription: req.params.id } });

  res.json({
    messsage: "Course Deleted",
  });
});

export const getAllStats = TryCatch(async (req, res) => {
  const totalCourses = (await Courses.find()).length;
  const totalLectures = (await Lecture.find()).length;
  const totalUsers = (await User.find()).length;

  const stats = {
    totalCourses,
    totalLectures,
    totalUsers,
  };

  res.json({
    stats,
  });
});

export const getMyCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find({ _id: req.user.subscription });
  res.json({ courses });
});

export const checkout = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  const course = await Courses.findById(req.params.id);
  if (user.subscription.includes(course._id)) {
    return res.status(400).json({
      message: "You Already Have this course",
    });
  }

  const options = {
    amount: Number(course.price * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(201).json({
    message: "New Order Created",
    order,
    course,
  });
});

export const paymentVerification = TryCatch(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.Razorpay_Secret)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    const user = await User.findById(req.user._id);
    const course = await Courses.findById(req.params.id);
    user.subscription.push(course._id);
    await user.save();
    return res.status(200).json({
      message: "Course Purchase Subscibed Successfully",
    });
  } else {
    return res.status(400).json({
      message: "Payment Failed",
    });
  }
});
