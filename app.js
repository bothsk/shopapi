require("dotenv").config();
const express = require("express");
const app = express();
const indexRoute = require("./routes/indexRoute");
const itemRoute = require("./routes/itemRoute");

const mongoose = require("mongoose");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const cookieParser = require("cookie-parser");

mongoose.connect(
  process.env.mongoURL,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log("Database connected");
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(
  session({
    secret: process.env.passportSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.mongoURL,
      rolling: true,
      ttl: 1 * 24 * 60 * 60, //1 Day
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRoute);
app.use("/shop", itemRoute);

app.use((req, res) => {
  res
    .status(404)
    .json({ status: { error: true, message: "404 Page not found" } });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port http://localhost:${process.env.PORT}`);
});
