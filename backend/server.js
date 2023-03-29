const express = require("express");
const http = require("http");
require("dotenv").config();

// To connect with your mongoDB database
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const socketIo = require("socket.io");

const { pendingToAutoCancel } = require("./cron");
const { PORT, DB_URL, DB_NAME } = process.env;

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

const routes = require("./routes"); // import the routes
const { addUser, removeUser } = require("./common");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

// Creating a cron job which runs on every hour
cron.schedule("0 * * * *", pendingToAutoCancel);

const router = express.Router();
router.use(function (req, res, next) {
  console.log("req", req);
});

app.use("/api", routes); //to use the routes
const server = http.createServer(app);

const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  // Add a user to a room
  socket.on("join", (options) => {
    const { user } = addUser({ id: socket.id, ...options });
    socket.join(user.room);

    socket.on("sendMessage", ({ AllMessages, messageData }) => {
      socket.broadcast
        .to(user.room)
        .emit("message", { AllMessages, messageData });
    });

    socket.on("sendBadge", ({ AllBadge, messageData }) => {
      socket.broadcast
        .to(user.room)
        .emit("receiveBadge", { AllBadge, messageData });
    });

    socket.on("resetBadgeServer", ({ AllBadge, user_id }) => {
      socket.broadcast
        .to(user.room)
        .emit("receiveBadgeClient", { AllBadge, user_id });
    });

    // We can write our socket event listeners in here...
    socket.on("disconnect", () => {
      // const user = removeUser(socket.id);
      console.log("Client disconnected");
    });
  });
});
server.listen(PORT || 4000, () => console.log(`Listening on port ${PORT}`));
