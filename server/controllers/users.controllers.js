import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"; // Not { JWT }
import bcrypt from "bcrypt"; // Not { bcrypt }
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email ALready Exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user = {
      name,
      email,
      hashPassword,
    };
    const otp = Math.floor(Math.random() * 1000000);
    const activationToken = jwt.sign(
      {
        user,
        otp,
      },
      process.env.Activation_Secret,
      {
        expiresIn: "5m",
      }
    );
    const data = {
      name,
      otp,
    };
    await sendMail(email, "E Learning Platform", data);
    return res.status(200).json({
      message: "Otp send to your mail",
      activationToken: activationToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;
  const verify = jwt.verify(activationToken, process.env.Activation_Secret);
  if (!verify) {
    return res.status(400).json({
      message: "OTP Expired",
    });
  }
  //   console.log(verify);

  if (verify.otp !== otp) {
    return res.status(400).json({
      message: "Wrong Otp",
    });
  }
  await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.hashPassword,
  });
  res.json({
    message: "User Registrated",
  });
});

export const LoginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "No User is not found",
    });
  }
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    return res.status(400).json({
      message: "Password is not correct",
    });
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  return res.status(200).json({
    message: `Welcome Back . ${user.name}`,
    token,
    user,
  });
});

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ user });
});
