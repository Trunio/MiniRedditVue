const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("../passport");
var client = require("../postgres");
const uuid = require("uuid");
const emailSender = require("../services/mailService");
router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    console.log(user);
    if (err || !user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.login(user, { session: false }, (err) => {
      if (err) res.send(err);
      const token = jwt.sign(user, "secret");
      return res.json({ user, token });
    });
  })(req, res);
});
router.post("/remind", async function (req, res, next) {
  let randPassword = Array(8)
    .fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
    .map(function (x) {
      return x[Math.floor(Math.random() * x.length)];
    })
    .join("");
  const salt = await bcrypt.genSalt(10);
  const encodePassword = await bcrypt.hash(randPassword + "1", salt);
  const setPassword = await client.query(
    `update reddit_user set password = $1 where email = $2 RETURNING *`,
    [encodePassword, req.body.email]
  );
  if (setPassword.rows.length !== 0) {
    await emailSender.remind(req.body.email, randPassword + "1");
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});
router.get("/verify/:id", async function (req, res, next) {
  const getUser = await client.query(
    `select * from reddit_user where activation_guid = $1`,
    [req.params.id]
  );
  if (getUser.rows[0].activation_expire_date > new Date()) {
    const changeUser = await client.query(
      `update reddit_user set activation_expire_date = $1, activation_guid = $2  where id = $3 RETURNING *`,
      [null, null, getUser.rows[0].id]
    );
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});
router.post("/register", async function (req, res, next) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const emailRegex = /\S+@\S+\.\S+/;
  const salt = await bcrypt.genSalt(10);
  if (!passwordRegex.test(String(req.body.password))) {
    return res.send(404).json({
      message:
        "Password must be min 8 letters and contain one letter and one number",
    });
  }
  if (!emailRegex.test(req.body.email)) {
    return res.send(404).json({ message: "Email is in invalid format" });
  }
  const check = await client.query(
    `select true from reddit_user where nickname = $1 limit 1`,
    [req.body.nickname]
  );
  const checkEmail = await client.query(
    `select * from reddit_user where email = $1`,
    [req.body.email]
  );
  if (check.rows.length === 0 && checkEmail.rows.length === 0) {
    const encodePassword = await bcrypt.hash(req.body.password, salt);
    let newUUID = uuid.v1();
    const result = await client.query(
      `INSERT INTO reddit_user (nickname,password,email, activation_guid, activation_expire_date) VALUES ($1,$2,$3,$4,NOW()::timestamp + interval '7 days') RETURNING *`,
      [req.body.nickname, encodePassword, req.body.email, newUUID]
    );
    await emailSender.verify(req.body.email, newUUID);
    res.send(result.rows);
  } else {
    return res.status(409).json({ error: "User already exists" }).end();
  }
});
module.exports = router;
