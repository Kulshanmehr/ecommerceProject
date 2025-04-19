import express from "express";
import dotenv from "dotenv";
import { connectDB } from "../server/database/db.js";
import userRoutes from "../server/routes/user.routes.js";
import courseRoutes from "../server/routes/courses.routes.js";
import adminRoutes from "../server/routes/admin.routes.js";
import Razorpay from "razorpay";
import cors from "cors";
dotenv.config();

export const instance = new Razorpay({
  key_id: process.env.Razorpay_Key,
  key_secret: process.env.Razorpay_Secret,
});

const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on Http:localhost:${PORT}`);
  connectDB();
});
