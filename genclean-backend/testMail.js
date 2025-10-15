const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "antonulrichtorres@gmail.com", // your Gmail
        pass: "nufbfststqopdkws", // your Gmail App Password
    },
});

(async () => {
    try {
        console.log("⏳ Testing SMTP connection...");
        await transporter.verify();
        console.log("✅ SMTP connection works fine!");
    } catch (err) {
        console.error("❌ SMTP connection failed:");
        console.error(err);
    }
})();
