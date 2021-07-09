require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var multer = require("multer");
const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var usersRouter = require("./routes/users");
var subredditRouter = require("./routes/subreddit");
var postRouter = require("./routes/post");
var commentsRouter = require("./routes/comments");
var client = require("./postgres");
var app = express();
const userServiceMidl = require("./services/moderatorService")();
const commentServiceMidl = require("./services/commentService")();
const postServiceMidl = require("./services/postService")();
const adminServiceMidl = require("./services/adminService")();
const auth = require("./routes/auth");
cors = require("cors");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
const server = app.listen(3000, () => {
  console.log("App is runnning on 3000");
});
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", async (socket) => {
  console.log(io.engine.clientsCount);
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, "secret", function (err, decoded) {
      if (err) return;
      socket.decoded = decoded;
      socket.join(socket.decoded.id);
    });
  }
});
// io.use(function (socket, next) {
//   if (socket.handshake.query && socket.handshake.query.token) {
//     jwt.verify(socket.handshake.query.token, "secret", function (err, decoded) {
//       if (err) return next(new Error("Authentication error"));
//       socket.decoded = decoded;
//       next();
//     });
//   } else {
//     next(new Error("Authentication error"));
//   }
// });
const passport = require("./passport");
app.set("socketio", io);
app.use("/auth", auth);
app.use(
  "/users",
  passport.authenticate("jwt", { session: false }),
  adminServiceMidl,
  usersRouter
);
app.use(
  "/subreddit",
  passport.authenticate("jwt", { session: false }),
  userServiceMidl,
  subredditRouter
);
app.use(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  postServiceMidl,
  postRouter
);
app.use(
  "/comments",
  passport.authenticate("jwt", { session: false }),
  commentServiceMidl,
  commentsRouter
);
module.exports = app;
