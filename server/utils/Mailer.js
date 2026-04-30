const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  // Use environment SMTP config if available, fallback to Ethereal test account
  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Development: log emails to console
    transporter = {
      sendMail: async (opts) => {
        console.log("\n[Email (dev mode)]");
        console.log("  To:", opts.to);
        console.log("  Subject:", opts.subject);
        console.log("  Body:", opts.text || opts.html);
        console.log("");
        return { messageId: "dev-" + Date.now() };
      },
    };
  }

  return transporter;
};

exports.sendAlertEmail = async ({ to, alertType, message, details }) => {
  try {
    const t = getTransporter();

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ef4444; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">⚠️ DevCollab Alert</h1>
        </div>
        <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin-top: 0;">${alertType.replace(/_/g, " ").toUpperCase()}</h2>
          <p style="color: #374151; font-size: 16px;">${message}</p>
          ${
            details
              ? `<div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin-top: 16px;">
                  <strong style="color: #6b7280;">Details:</strong>
                  <pre style="color: #374151; margin: 8px 0 0; font-size: 13px;">${JSON.stringify(details, null, 2)}</pre>
                </div>`
              : ""
          }
          <p style="color: #9ca3af; font-size: 12px; margin-bottom: 0;">
            Sent by DevCollab Monitoring • ${new Date().toUTCString()}
          </p>
        </div>
      </div>
    `;

    await t.sendMail({
      from: process.env.SMTP_FROM || "DevCollab <alerts@devcollab.io>",
      to,
      subject: `[DevCollab Alert] ${alertType.replace(/_/g, " ")}`,
      text: message,
      html,
    });

    return true;
  } catch (err) {
    console.error("Email send error:", err);
    return false;
  }
};

exports.sendWelcomeEmail = async ({ to, name }) => {
  try {
    const t = getTransporter();

    await t.sendMail({
      from: process.env.SMTP_FROM || "DevCollab <hello@devcollab.io>",
      to,
      subject: "Welcome to DevCollab!",
      text: `Hi ${name}, welcome to DevCollab! Your account is ready.`,
      html: `<p>Hi <strong>${name}</strong>, welcome to <strong>DevCollab</strong>! Your account is ready to use.</p>`,
    });

    return true;
  } catch (err) {
    console.error("Email send error:", err);
    return false;
  }
};