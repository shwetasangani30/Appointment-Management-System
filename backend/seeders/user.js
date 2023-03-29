require("dotenv").config();

// To connect with your mongoDB database
const mongoose = require("mongoose");
const { UserSchema } = require("../models/usermodel");

const { DB_URL, DB_NAME } = process.env;

mongoose.connect(
  DB_URL,
  {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) =>
    err
      ? console.log(err)
      : console.log("Connected to " + DB_NAME + " database")
);

const userSeed = [
  {
    name: "Admin",
    email: "admin@admin.com",
    password: "$2b$10$uzkU9jnyKFjP3XfzY95w3OhUfOqlQh.WpqLOa9SXwW3BgPma/T3am",
    role: 1,
    token: null,
  },
  {
    name: "Appointee",
    email: "appointee@admin.com",
    password: "$2b$10$uzkU9jnyKFjP3XfzY95w3OhUfOqlQh.WpqLOa9SXwW3BgPma/T3am",
    role: 2,
    token: null,
  },
  {
    name: "Client",
    email: "client@admin.com",
    password: "$2b$10$uzkU9jnyKFjP3XfzY95w3OhUfOqlQh.WpqLOa9SXwW3BgPma/T3am",
    role: 3,
    token: null,
  },
];

const seedDB = async () => {
  await UserSchema.insertMany(userSeed);
};

seedDB().then(() => {
  mongoose.connection.close();
});
