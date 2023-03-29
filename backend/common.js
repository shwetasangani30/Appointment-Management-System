const nodemailer = require("nodemailer");
const users = [];
const validation = (schema, requestBody, res) => {
  const validation = schema.validate(requestBody);
  const { error } = validation;
  const valid = error == null;

  if (!valid) {
    res.status(400).send({
      status: 400,
      message: error?.details[0]?.message.replace(/"/g, ""),
      data: requestBody,
    });
  } else {
    return true;
  }
};

const generatePassword = (length) => {
  let chars = "1234567890!@#$%^&*()_+></abcdefghijklmnopqrstuwxyz";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

async function sendMail(to, subject, message) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTPHOST,
    port: process.env.SMTPPORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTPUSERNAME,
      pass: process.env.SMTPAPPKEY,
    },
  });

  let info = await transporter.sendMail({
    from: process.env.SMTPUSERNAME,
    to: to,
    subject: subject,
    html: message,
  });
  transporter.close();
  return info?.messageId;
}

const addUser = ({ id, userData, room }) => {
  console.log("room", room);
  // Clean the data
  user_id = userData?._id;
  room = room.trim().toLowerCase();

  // Validate the data
  if (!user_id || !room) {
    return {
      error: "user_id and room are required!",
    };
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.user_id === user_id;
  });

  // Validate user_id
  if (existingUser) {
    return {
      error: "user is in use!",
    };
  }

  // Store user
  const user = { id, userData, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

module.exports = {
  validation,
  sendMail,
  generatePassword,
  addUser,
  removeUser,
};
