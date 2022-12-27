var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
let mongoose = require("mongoose");
let session = require("express-session");
let mongoStore = require("connect-mongo");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
let passport = require("passport");

// connect database
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost/login-with-github-and-google", (err) => {
  console.log(err ? err : `sucessfully connected`);
});
require("./modules/passport");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// session middelware
app.use(
  session({
    secret: process.env.SECRETE,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
      mongoUrl: `mongodb://localhost/login-with-github-and-google`,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
