import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Check if environment variables are loaded correctly
if (!process.env.ZOHO_EMAIL || !process.env.ZOHO_PASSWORD) {
    console.error("❌ Missing environment variables: ZOHO_EMAIL or ZOHO_PASSWORD");
    process.exit(1);
}

// Create SMTP transporter for Zoho Mail
const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465, // Use 465 for SSL, or 587 for TLS
    secure: true, // true for SSL, false for TLS
    auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD, // Use App Password if 2FA is enabled
    },
});

// Function to send an email
export const sendEmail = async (to:any, subject:any, text:any) => {
    try {
        console.log("📤 Sending email...");
        console.log("🔹 To:", to);
        console.log("🔹 Subject:", subject);

        const mailOptions = {
            from: process.env.ZOHO_EMAIL,
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.response);
        return info;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw error;
    }
};


