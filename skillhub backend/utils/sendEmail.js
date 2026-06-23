import nodemailer from "nodemailer";

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER, // Your test email
        pass: process.env.EMAIL_PASS,    // Your generated 16-character app password
      },
    });

    await transporter.sendMail({
      from: '"SkillHub Support" <your_email@gmail.com>',
      to: email,
      subject: subject,
      text: text,
    });
    
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email not sent:", error);
  }
};

export default sendEmail;