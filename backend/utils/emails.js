import dotenv from "dotenv";
dotenv.config({});

import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, NEW_HR_ADDED_TEMPLATE,  HR_ASSIGNED_TEMPLATE,   FOLLOW_UP_REMINDER_TEMPLATE } from "../assets/emailTemplates.js";
import transporter from "../config/nodemailer.js";

const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_SENDER_EMAIL,
            to: email,
            subject: 'Verify Your Email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        }

        const response = await transporter.sendMail(mailOptions);
        console.log("Verification code sent successfully");
        console.log(verificationToken);
        
    } catch (error) {
        console.error("Error sending verification email:", error.message);
    }
}

const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        // console.log("email",email)
        const mailOptions = {
            from: process.env.SMTP_SENDER_EMAIL,
            to: email,
            subject: 'Reset your password',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        }

        const response = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully", response);

    } catch (error) {
        console.error("Error sending password reset email:", error.message);
    }
}

const sendPasswordResetSuccessEmail = async (email) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_SENDER_EMAIL,
            to: email,
            subject: 'Password Reset Successful',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        }

        const response = await transporter.sendMail(mailOptions);
        console.log("Password reset success email sent successfully", response);

    } catch (error) {
        console.error("Error sending password reset email:", error.message);
    }
}



const sendNewHRAddedEmail = async (adminEmail, callerName, company) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_SENDER_EMAIL,
      to: adminEmail,
      subject: "New HR Contact Added",
      html: NEW_HR_ADDED_TEMPLATE
        .replace("{callerName}", callerName)
        .replace("{company}", company),
    };
    await transporter.sendMail(mailOptions);
    console.log("New HR added email sent");
  } catch (err) {
    console.error("Error sending new HR added email:", err.message);
  }
};

const sendHRAssignedEmail = async (callerEmail, callerName, hrName, company) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_SENDER_EMAIL,
      to: callerEmail,
      subject: "HR Assigned to You",
      html: HR_ASSIGNED_TEMPLATE
        .replace("{callerName}", callerName)
        .replace("{hrName}", hrName)
        .replace("{company}", company),
    };
    await transporter.sendMail(mailOptions);
    console.log("HR assigned email sent");
  } catch (err) {
    console.error("Error sending HR assigned email:", err.message);
  }
};

const sendFollowUpReminderEmail = async (callerEmail, hrName, cycle) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_SENDER_EMAIL,
      to: callerEmail,
      subject: "Follow-up Reminder",
      html: FOLLOW_UP_REMINDER_TEMPLATE
        .replace("{hrName}", hrName)
        .replace("{cycle}", cycle),
    };
    await transporter.sendMail(mailOptions);
    console.log("Follow-up reminder email sent");
  } catch (err) {
    console.error("Error sending follow-up reminder email:", err.message);
  }
};





export { sendVerificationEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail, sendNewHRAddedEmail, sendHRAssignedEmail, sendFollowUpReminderEmail };