const nodemailer = require('nodemailer');

let transporter;

const initTransporter = async () => {
  if (!transporter) {

    transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
      auth: {
        user: 'kira.runte4@ethereal.email',
        pass: 's5JjcsfpyGGScwK2WA'
      },
    });
  }
};

const sendWelcomeMail = async (toEmail, name, otp) => {
  try {
    await initTransporter();

    const info = await transporter.sendMail({
      from: '"BildKart Team" <bildkartsupport@bildkart.com>',
      to: toEmail,
      subject: "Welcome to BildKart!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; color: #333;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <h2 style="color: #0d6efd;">Welcome to BildKart, ${name}!</h2>
        <p style="font-size: 16px; line-height: 1.6;">
          We're thrilled to have you join our community. BildKart is your trusted platform for construction materials and services.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          To complete your registration, please use the OTP below to verify your email address.
        </p>

        <div style="margin: 30px 0; text-align: center;">
          <span style="display: inline-block; padding: 15px 30px; background-color: #0d6efd; color: #ffffff; font-size: 24px; font-weight: bold; border-radius: 8px;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">
          If you have any questions or need assistance, feel free to contact our support team at 
          <a href="mailto:bildkartsupport@bildkart.com" style="color: #0d6efd;">bildkartsupport@bildkart.com</a>.
        </p>

        <p style="margin-top: 40px; font-size: 16px;">
          Best regards,<br/>
          Mridul Saklani<br/>
          <strong>The BildKart Team</strong>
        </p>
      </div>

      <p style="text-align: center; font-size: 12px; color: #888; margin-top: 20px;">
        © ${new Date().getFullYear()} BildKart. All rights reserved.
      </p>
    </div>
      `,
    });

    console.log("Email sent: %s", info.messageId);
    console.log(" Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error(" Error sending welcome mail:", error);
  }
};

const sendUserVerificationMail = async (toEmail, otp) => {
  try {
    await initTransporter()
    const info = await transporter.sendMail({
      from: '"BildKart Team" <bildkartsupport@bildkart.com>',
      to: toEmail,
      subject: "Welcome to BildKart!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; color: #333;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <h2 style="color: #0d6efd;">Welcome back to BildKart, !</h2>
        <p style="font-size: 16px; line-height: 1.6;">
          We send you user verification OTP
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          To want reset your password, please use the OTP below to verify your email address.
        </p>

        <div style="margin: 30px 0; text-align: center;">
          <span style="display: inline-block; padding: 15px 30px; background-color: #0d6efd; color: #ffffff; font-size: 24px; font-weight: bold; border-radius: 8px;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">
          If you have any questions or need assistance, feel free to contact our support team at 
          <a href="mailto:bildkartsupport@bildkart.com" style="color: #0d6efd;">bildkartsupport@bildkart.com</a>.
        </p>

        <p style="margin-top: 40px; font-size: 16px;">
          Best regards,<br/>
          Mridul Saklani<br/>
          <strong>The BildKart Team</strong>
        </p>
      </div>

      <p style="text-align: center; font-size: 12px; color: #888; margin-top: 20px;">
        © ${new Date().getFullYear()} BildKart. All rights reserved.
      </p>
    </div>
      `,
    });

    console.log("Email sent: %s", info.messageId);
    console.log(" Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error(" Error sending User Verify mail:", error);
  }
  
}

module.exports = { sendWelcomeMail, sendUserVerificationMail };
