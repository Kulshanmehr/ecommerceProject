import { createTransport } from "nodemailer";

const sendMail = async (email, subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Hello ${data.name},</h2>
      <p>Thank you for registering with us!</p>
      <p>Your registered email is: <strong>${email}</strong></p>
      <p style="font-size: 18px;">🔐 Your OTP is: <strong>${data.otp}</strong></p>
      <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
      <br />
      <p>Best regards,<br/>Ecommerce Platform Team</p>
    </div>
  `;

  await transport.sendMail({
    from: `"Ecommerce Platform" <${process.env.Gmail}>`,
    to: email,
    subject: subject || "Your OTP Code",
    html: htmlTemplate,
  });
};

export default sendMail;
