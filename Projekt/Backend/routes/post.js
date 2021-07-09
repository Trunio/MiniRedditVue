const express = require("express");
const router = express.Router();
var client = require("../postgres");

router.get("/:name", async function (req, res, next) {
  const getId = await client.query(
    `select id from subreddit where name = $1 limit 1`,
    [req.params.name]
  );

  const check = await client.query(
    `
      select p.id, p.title, p.content, p.image_path, p.video_url, p.creation_date, p.user_id, r.nickname, s.name, CAST(COALESCE(v.vote, 0) as integer) as vote, sv.question,
       sv.id as question_id, CAST(COALESCE(sumVote.sum, 0) as integer) as sumVote from post p
  inner join reddit_user r on p.user_id = r.id
  inner join subreddit s on s.id = p.subreddit_id
  left join survey sv on p.id = sv.post_id
  left join ( select sum(vote), post_id from post_vote group by post_id ) as sumVote on sumVote.post_id = p.id
  left join ( select post_id, vote from post_vote where post_vote.user_id = $1 ) as v on p.id = v.post_id where subreddit_id = $2 order by p.creation_date desc`,
    [req.user.id, getId.rows[0].id]
  );
  for (const val of check.rows) {
    const index = check.rows.indexOf(val);
    if (val.question !== null) {
      const getAnswers = await client.query(
        `select s.id, s.answer, s.survey_id, voted.count as voted from survey_answer s
         left join ( select count(*), user_id, answer_id from survey_user_answer where survey_user_answer.user_id = $1 group by id ) as voted on voted.answer_id = s.id
         where survey_id = $2`,
        [req.user.id, val.question_id]
      );
      check.rows[index].answers = getAnswers.rows;
      for (const ans of getAnswers.rows) {
        const id = check.rows[index].answers.indexOf(ans);
        const getUsers = await client.query(
          `select s.id, s.answer_id, u.nickname from survey_user_answer s left join reddit_user u on u.id = s.user_id 
           where s.answer_id = $1`,
          [ans.id]
        );
        check.rows[index].answers[id].users = getUsers.rows;
      }
    }
  }
  if (check.rows.length === 0) {
    return res.send(404).json({ error: "No Posts" });
  } else {
    res.send(check.rows);
  }
});

router.get("/user/home/", async function (req, res, next) {
  let check = null;
  if (req.query.sort === "new") {
    check = await client.query(
      `select p.id, p.title, p.content, p.image_path, p.video_url, p.creation_date,p.user_id, r.nickname, s.name, CAST(COALESCE(v.vote, 0) as integer) as vote,
  CAST(COALESCE(sumVote.sum, 0) as integer) as sumVote, sv.question, sv.id as question_id
  from post p
  inner join reddit_user r on p.user_id = r.id
  inner join subreddit s on s.id = p.subreddit_id
  left join ( select post_id, vote from post_vote where post_vote.user_id = $1 ) as v on p.id = v.post_id
  left join ( select sum(vote), post_id from post_vote group by post_id ) as sumVote on sumVote.post_id = p.id
  left join subreddit_user t on t.subreddit_id = s.id
  left join survey sv on p.id = sv.post_id
  where t.user_id = $1 order by p.creation_date desc`,
      [req.user.id]
    );
  }
  if (req.query.sort === "best") {
    check = await client.query(
      `  select p.id, p.title, p.content, p.image_path, p.video_url, p.creation_date, p.user_id,r.nickname, s.name, CAST(COALESCE(v.vote, 0) as integer) as vote,
  CAST(COALESCE(sumVote.sum, 0) as integer) as sumVote, sv.question, sv.id as question_id
  from post p
  inner join reddit_user r on p.user_id = r.id
  left join survey sv on p.id = sv.post_id
  inner join subreddit s on s.id = p.subreddit_id
  left join ( select post_id, vote from post_vote where post_vote.user_id = $1 ) as v on p.id = v.post_id
  left join subreddit_user t on t.subreddit_id = s.id
  left join ( select sum(vote), post_id from post_vote group by post_id ) as sumVote on sumVote.post_id = p.id
  where t.user_id = $1 order by sumVote desc`,
      [req.user.id]
    );
  }
  if (req.query.sort === "hot") {
    check = await client.query(
      `  select p.id, p.title, p.content, p.image_path, p.video_url, p.creation_date,p.user_id, r.nickname, s.name, CAST(COALESCE(v.vote, 0) as integer) as vote,
  CAST(COALESCE(sumVote.sum, 0) as integer) as sumVote, sv.question, sv.id as question_id
  from post p
  inner join reddit_user r on p.user_id = r.id
  inner join subreddit s on s.id = p.subreddit_id
  left join ( select post_id, vote from post_vote where post_vote.user_id = $1 ) as v on p.id = v.post_id
  left join subreddit_user t on t.subreddit_id = s.id
  left join ( select sum(vote), post_id from post_vote group by post_id ) as sumVote on sumVote.post_id = p.id
  left join survey sv on p.id = sv.post_id
  where t.user_id = $1 order by COALESCE(sumVote.sum/(extract(epoch from NOW()) - extract(epoch from p.creation_date)), 0) DESC`,
      [req.user.id]
    );
  }
  if (req.query.sort === "controversial") {
    check = await client.query(
      `  select p.id, p.title, p.content, p.image_path, p.video_url, p.creation_date,p.user_id, r.nickname, s.name, CAST(COALESCE(v.vote, 0) as integer) as vote,
  CAST(COALESCE(sumVote.sum, 0) as integer) as sumVote, sv.question, sv.id as question_id
  from post p
  inner join reddit_user r on p.user_id = r.id
  inner join subreddit s on s.id = p.subreddit_id
  left join ( select post_id, vote from post_vote where post_vote.user_id = $1 ) as v on p.id = v.post_id
  left join subreddit_user t on t.subreddit_id = s.id
  left join ( select sum(vote), post_id from post_vote group by post_id ) as sumVote on sumVote.post_id = p.id
  left join ( select count(vote), post_id from post_vote group by post_id ) as contVote on contVote.post_id = p.id
  left join survey sv on p.id = sv.post_id
  where t.user_id = $1 order by COALESCE(contVote.count/(extract(epoch from NOW()) - extract(epoch from p.creation_date)), 0) DESC`,
      [req.user.id]
    );
  }
  for (const val of check.rows) {
    const index = check.rows.indexOf(val);
    if (val.question !== null) {
      const getAnswers = await client.query(
        `select s.id, s.answer, s.survey_id, voted.count as voted from survey_answer s
         left join ( select count(*), user_id, answer_id from survey_user_answer where survey_user_answer.user_id = $1 group by id ) as voted on voted.answer_id = s.id
         where survey_id = $2`,
        [req.user.id, val.question_id]
      );
      check.rows[index].answers = getAnswers.rows;
      for (const ans of getAnswers.rows) {
        const id = check.rows[index].answers.indexOf(ans);
        const getUsers = await client.query(
          `select s.id, s.answer_id, u.nickname from survey_user_answer s left join reddit_user u on u.id = s.user_id 
           where s.answer_id = $1`,
          [ans.id]
        );
        check.rows[index].answers[id].users = getUsers.rows;
      }
    }
  }
  if (check.rows.length === 0) {
    res.status(404).send({ error: "no posts" });
  } else {
    res.send(check.rows);
  }
});

router.get("/single/:id", async function (req, res, next) {
  const check = await client.query(
    `
      select p.id, p.title, p.content, p.image_path, p.video_url, p.creation_date, p.user_id,r.nickname, s.name, CAST(COALESCE(v.vote, 0) as integer) as vote, sv.question, sv.id as question_id,
       CAST(COALESCE(sumVote.sum, 0) as integer) as sumVote from post p
  inner join reddit_user r on p.user_id = r.id
  inner join subreddit s on s.id = p.subreddit_id
  left join survey sv on p.id = sv.post_id
  left join ( select sum(vote), post_id from post_vote group by post_id ) as sumVote on sumVote.post_id = p.id
  left join ( select post_id, vote from post_vote where post_vote.user_id = $1 ) as v on p.id = v.post_id where p.id = $2`,
    [req.user.id, req.params.id]
  );
  for (const val of check.rows) {
    const index = check.rows.indexOf(val);
    if (val.question !== null) {
      const getAnswers = await client.query(
        `select s.id, s.answer, s.survey_id, voted.count as voted from survey_answer s
         left join ( select count(*), user_id, answer_id from survey_user_answer where survey_user_answer.user_id = $1 group by id ) as voted on voted.answer_id = s.id
         where survey_id = $2`,
        [req.user.id, val.question_id]
      );
      check.rows[index].answers = getAnswers.rows;
      for (const ans of getAnswers.rows) {
        const id = check.rows[index].answers.indexOf(ans);
        const getUsers = await client.query(
          `select s.id, s.answer_id, u.nickname from survey_user_answer s left join reddit_user u on u.id = s.user_id 
           where s.answer_id = $1`,
          [ans.id]
        );
        check.rows[index].answers[id].users = getUsers.rows;
      }
    }
  }
  return res.send(check.rows);
});

router.get("/home/search", async function (req, res, next) {
  const check = await client.query(
    `select * from post where LOWER(content) ~ $1 limit 6`,
    [req.query.name]
  );
  res.send(check.rows);
});

router.get("/stats/Best", async function (req, res, next) {
  const check = await client.query(
    `select p.id, p.title, p.content, p.image_path, p.video_url, p.creation_date,p.user_id,
  CAST(COALESCE(sumVote.sum, 0) as integer) as sumVote,
  CAST(COALESCE(comSum.count, 0) as integer) as comments
  from post p
  left join ( select count(*), post_id from comment group by post_id ) as comSum on comSum.post_id = p.id
  left join ( select sum(vote), post_id from post_vote group by post_id ) as sumVote on sumVote.post_id = p.id order by sumVote Desc, comments Desc
`
  );
  res.send(check.rows);
});

// router.get("/:id/vote", async function (req, res, next) {
//   let body = {};
//   const check = await client.query(
//     `select vote from post_vote where user_id = $1 and post_id = $2 limit 1`,
//     [req.user.id, req.params.id]
//   );
//   return res.send(check.rows);
// });

router.delete("/:id", async function (req, res, next) {
  const deleteComments = await client.query(
    `delete from comment where post_id = $1`,
    [req.params.id]
  );
  const deletePostVotes = await client.query(
    `delete from post_vote where post_id = $1`,
    [req.params.id]
  );
  const getSurvey = await client.query(
    `select * from survey where post_id = $1`,
    [req.params.id]
  );
  if (getSurvey.rows.length > 0) {
    const getSurveyAnswers = await client.query(
      `select * from survey_answer where survey_id = $1`,
      [getSurvey.rows[0].id]
    );
    for (const val of getSurveyAnswers.rows) {
      const deleteUserAnswers = await client.query(
        `delete from survey_user_answer where answer_id = $1`,
        [val.id]
      );
    }
    const deleteSurveyAnswers = await client.query(
      `delete from survey_answer where survey_id = $1`,
      [getSurvey.rows[0].id]
    );
    const deleteSurvey = await client.query(
      `delete from survey where post_id = $1`,
      [req.params.id]
    );
  }
  const deletePost = await client.query(`delete from post where id = $1`, [
    req.params.id,
  ]);
  const io = req.app.get("socketio");
  io.emit(`deletePost/${req.params.id}/remove`, req.params.id);
  io.emit(`deletePost/remove/fromSubreddit`, req.params.id);
  io.emit(`deletePost/remove/fromHome`, req.params.id);
  return res.send(deletePost.rows);
});
router.post("/:id/survey/:survey_id", async function (req, res, next) {
  const check = await client.query(
    `select s.id, s.answer, s.survey_id, voted.count as voted from survey_answer s
inner join ( select count(*), user_id, answer_id from survey_user_answer where survey_user_answer.user_id = $1 group by id ) as voted on voted.answer_id = s.id
where survey_id = $2`,
    [req.user.id, req.params.survey_id]
  );
  console.log(req.params);
  if (check.rows.length === 0) {
    const insertSurvey = await client.query(
      `insert into survey_user_answer (answer_id, user_id) values ($1, $2)`,
      [req.query.answer_id, req.user.id]
    );
  } else {
    if (Number(req.query.answer_id) === check.rows[0].id) {
      const deleteAnswer = await client.query(
        `delete from survey_user_answer where user_id = $1 and answer_id = $2`,
        [req.user.id, req.query.answer_id]
      );
    } else {
      const updateAnswer = await client.query(
        `update survey_user_answer set answer_id = $1 where user_id = $2 and answer_id = $3 `,
        [req.query.answer_id, req.user.id, check.rows[0].id]
      );
    }
  }
  return res.send(200);
});

router.post("/:id/vote", async function (req, res, next) {
  let body = {};
  const check = await client.query(
    `select * from post_vote where user_id = $1 and post_id = $2 limit 1`,
    [req.user.id, req.params.id]
  );
  if (check.rows.length === 0) {
    if (req.query.action === "upVote") {
      const insertVote = await client.query(
        `INSERT INTO post_vote (vote, user_id,post_id) VALUES (1,$1, $2) RETURNING *`,
        [req.user.id, req.params.id]
      );
      body = { vote: "upvote" };
    }
    if (req.query.action === "downVote") {
      const insertVote = await client.query(
        `INSERT INTO post_vote (vote, user_id,post_id) VALUES (-1,$1, $2) RETURNING *`,
        [req.user.id, req.params.id]
      );
      body = { vote: "downvote" };
    }
  } else {
    const deleteVote = await client.query(
      `DELETE FROM post_vote WHERE user_id = $1 and post_id = $2 `,
      [req.user.id, req.params.id]
    );
    body = { vote: "none" };
    if (check.rows[0].vote === 1 && req.query.action === "downVote") {
      const insertVote = await client.query(
        `INSERT INTO post_vote (vote, user_id,post_id) VALUES (-1,$1, $2) RETURNING *`,
        [req.user.id, req.params.id]
      );
      body = { vote: "downvote" };
    }
    if (check.rows[0].vote === -1 && req.query.action === "upVote") {
      const insertVote = await client.query(
        `INSERT INTO post_vote (vote, user_id,post_id) VALUES (1,$1, $2) RETURNING *`,
        [req.user.id, req.params.id]
      );
      body = { vote: "upvote" };
    }
  }
  const getSumVotes = await client.query(
    `select 
  CAST(COALESCE(sumVote.sum, 0) as integer) as sumVote
  from post p
  left join ( select sum(vote), post_id from post_vote group by post_id ) as sumVote on sumVote.post_id = p.id where p.id = $1
`,
    [req.params.id]
  );
  console.log(getSumVotes.rows[0].sumvote);
  body.sum = getSumVotes.rows[0].sumvote;
  const io = req.app.get("socketio");
  io.emit(`post/${req.params.id}/vote`, getSumVotes.rows[0].sumvote);
  return res.send(body);
});

module.exports = router;
