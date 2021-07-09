const express = require("express");
const router = express.Router();
var client = require("../postgres");
const bcrypt = require("bcrypt");
router.get("/data", async function (req, res, next) {
  const getUser = await client.query(
    `select * from reddit_user where id = $1`,
    [req.user.id]
  );
  res.send(getUser.rows);
});

router.get("/all", async function (req, res, next) {
  const getUser = await client.query(`select * from reddit_user order by id`);
  res.send(getUser.rows);
});

router.put("/ban/:id", async function (req, res, next) {
  const banUser = await client.query(
    `update reddit_user set nickname = 'deleted user', password = '', email = '' where id = $1`,
    [req.params.id]
  );
  res.send(banUser.rows);
});

router.put("/edit", async function (req, res, next) {
  const checkEmail = await client.query(
    `select * from reddit_user where email = $1`,
    [req.body.email]
  );
  const checkUser = await client.query(
    `select * from reddit_user where nickname = $1`,
    [req.body.nickname]
  );
  if (checkEmail.rows.length === 0 || req.body.email === req.user.email) {
    if (
      checkUser.rows.length === 0 ||
      req.user.nickname === req.body.nickname
    ) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(String(req.body.password))) {
        return res.send(404).json({
          message:
            "Password must be min 8 letters and contain one letter and one number",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const encodePassword = await bcrypt.hash(req.body.password, salt);
      const getUser = await client.query(
        `UPDATE reddit_user SET nickname= '${req.body.nickname}', password = '${encodePassword}', email = '${req.body.email}'  where id = ${req.user.id} RETURNING *`
      );
      return res.send(getUser.rows);
    }
    return res.status(400).send({ error: "Nickname already exists!" });
  }
  return res.status(400).send({ error: "Email already exists!" });
});

module.exports = router;
