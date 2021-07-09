const express = require("express");
const router = express.Router();
var client = require("../postgres");
const util = require("util");
var multer = require("multer");
const upload = multer({
  dest: "./public/images",
});
router.post(
  "/:name/newPost",
  upload.single("file"),
  async function (req, res, next) {
    const getId = await client.query(
      `select id from subreddit where name = $1 limit 1`,
      [req.params.name]
    );
    let imagePath = null;
    if (req.file !== undefined) {
      imagePath = `http://89.71.195.48:3000/images/${req.file.filename}`;
    }
    const insertPost = await client.query(
      `INSERT INTO post (title, content, image_path, video_url, creation_date, subreddit_id, user_id) VALUES ($1,$2,$3, $4, now()::timestamp ,$5,$6) RETURNING *`,
      [
        req.body.title,
        req.body.content,
        imagePath,
        req.body.video,
        getId.rows[0].id,
        req.user.id,
      ]
    );
    if (req.body.survey_name) {
      const insertSurvey = await client.query(
        `INSERT INTO survey (question, post_id) VALUES ($1,$2) RETURNING *`,
        [req.body.survey_name, insertPost.rows[0].id]
      );
      for (let i = 0; i < req.body.survey_len; i++) {
        await client.query(
          `INSERT INTO survey_answer (answer, survey_id) VALUES ($1,$2) RETURNING *`,
          [req.body[`survey_ans${i}`], insertSurvey.rows[0].id]
        );
      }
    }
    res.send(insertPost.rows);
  }
);
router.get("/:name", async function (req, res, next) {
  const check = await client.query(
    `select * from subreddit where name = $1 limit 1`,
    [req.params.name]
  );
  if (check.rows.length === 0) {
    return res.send(404).json({ error: "No subreddit" });
  } else {
    res.send(check.rows);
  }
});
router.get("/stats/bestSubs", async function (req, res, next) {
  const check = await client.query(
    `SELECT  s.id, s.name, CAST(COALESCE(sumPost.count, 0) as integer) as posts, CAST(COALESCE(sumUser.count, 0) as integer) as users
FROM subreddit s
left join ( select count (*) as count, subreddit.name from post inner join subreddit on 
    subreddit_id = subreddit.id group by subreddit.name ) as sumPost on sumPost.name = s.name
left join (select count (*) as count, s.name from subreddit_user inner join subreddit  s 
         on subreddit_id = s.id group by s.name) as sumUser on sumUser.name = s.name order by posts desc, users desc limit 6`
  );
  if (check.rows.length === 0) {
    return res.send(404).json({ error: "No subreddits" });
  } else {
    res.send(check.rows);
  }
});
router.get("/stats/Subs", async function (req, res, next) {
  const check = await client.query(
    `SELECT  s.id, s.name, CAST(COALESCE(sumPost.count, 0) as integer)  as posts, CAST(COALESCE(sumVote.sum, 0) as integer) as votes, CAST(COALESCE(sumUser.count, 0) as integer) as users
FROM subreddit s
left join ( select count (*) as count, subreddit.name from post inner join subreddit on 
    subreddit_id = subreddit.id group by subreddit.name ) as sumPost on sumPost.name = s.name
left join ( select sum(vote), subreddit_id from post_vote inner join post on post.id = post_id group by post.subreddit_id ) as sumVote on sumVote.subreddit_id = s.id
left join (select count (*) as count, s.name from subreddit_user inner join subreddit  s 
         on subreddit_id = s.id group by s.name) as sumUser on sumUser.name = s.name order by posts desc, users desc`
  );
  if (check.rows.length === 0) {
    return res.send(404).json({ error: "No subreddits" });
  } else {
    res.send(check.rows);
  }
});
router.get("/home/search", async function (req, res, next) {
  const check = await client.query(
    `select * from subreddit where LOWER(name) ~ $1 limit 6`,
    [req.query.name]
  );
  res.send(check.rows);
});
router.put("/:name", async function (req, res, next) {
  const check = await client.query(
    `update subreddit set name = $1, description = $2 where name = $3 RETURNING *`,
    [req.body.name, req.body.description, req.params.name]
  );
  res.send(check.rows);
});
router.get("/:name/checkMod", async function (req, res, next) {
  const getId = await client.query(
    `select id from subreddit where name = $1 limit 1`,
    [req.params.name]
  );
  const check = await client.query(
    `select * from subreddit_moderator where user_id = $1 and subreddit_id = $2 limit 1`,
    [req.user.id, getId.rows[0].id]
  );
  if (check.rows.length === 0) {
    res.status(400).send({ error: "not a mod!" });
  } else {
    res.send(check.rows);
  }
});
router.get("/:name/getMods", async function (req, res, next) {
  const getId = await client.query(
    `select id from subreddit where name = $1 limit 1`,
    [req.params.name]
  );
  const check = await client.query(
    `select * from reddit_user inner join subreddit_moderator on subreddit_moderator.user_id = reddit_user.id where subreddit_moderator.subreddit_id = $1`,
    [getId.rows[0].id]
  );
  if (check.rows.length === 0) {
    return res.send(404).json({ error: "Is not a mod" });
  } else {
    res.send(check.rows);
  }
});
router.get("/:name/checkSub", async function (req, res, next) {
  const getId = await client.query(
    `select id from subreddit where name = $1 limit 1`,
    [req.params.name]
  );
  const check = await client.query(
    `select * from subreddit_user where user_id = $1 AND subreddit_id = $2 limit 1`,
    [req.user.id, getId.rows[0].id]
  );
  res.send(check.rows);
});
router.post("/:name/join", async function (req, res, next) {
  const getId = await client.query(
    `select id from subreddit where name = $1 limit 1`,
    [req.params.name]
  );
  const check = await client.query(
    `select * from subreddit_user where user_id = $1 AND subreddit_id = $2 limit 1`,
    [req.user.id, getId.rows[0].id]
  );
  if (check.rows.length === 0) {
    const insertSub = await client.query(
      `INSERT INTO subreddit_user (user_id,subreddit_id) VALUES ($1,$2) RETURNING *`,
      [req.user.id, getId.rows[0].id]
    );
  } else {
    const deleteSub = await client.query(
      `DELETE FROM subreddit_user WHERE user_id = $1 AND subreddit_id = $2`,
      [req.user.id, getId.rows[0].id]
    );
  }
  res.send(check.rows);
});
router.post("/create", async function (req, res, next) {
  const check = await client.query(
    `select true from subreddit where name = $1 limit 1`,
    [req.body.name]
  );
  if (check.rows.length === 0) {
    const result = await client.query(
      `INSERT INTO subreddit (name,description) VALUES ($1,$2) RETURNING *`,
      [req.body.name, req.body.description]
    );
    const resultMod = await client.query(
      `INSERT INTO subreddit_moderator (user_id, subreddit_id) VALUES ($1,$2) RETURNING *`,
      [req.user.id, result.rows[0].id]
    );
    const resultSub = await client.query(
      `INSERT INTO subreddit_user (user_id, subreddit_id) VALUES ($1,$2) RETURNING *`,
      [req.user.id, result.rows[0].id]
    );
    res.send(result.rows);
  } else {
    return res.send(409).json({ error: "Subreddit already exists" });
  }
});

module.exports = router;
