const nodemailer = require('nodemailer');

// Gmail configuration
const gmailEmail = process.env.EMAIL_USER;
const gmailPassword = process.env.EMAIL_PASSWORD;
// Create transporter with Gmail service
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },                                                           
});

// Function to send email
const sendEmail = (emails, subject, html) => {
  // Set email options
  const mailOptions = {
    from: `"NAME" <${gmailEmail}>`, // Sender name and email
    to: emails, // Comma separated list or an array of recipients' email addresses
    subject: subject, // Email subject
    html: html, // HTML body content
  };

  // Send email to recipients
  return mailTransport.sendMail(mailOptions)
    .then((info) => {
      console.log('Email sent:', info.response);
      return { success: true, messageId: info.messageId };
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    });
};

module.exports = sendEmail;
