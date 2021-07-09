const express = require("express");
const router = express.Router();
var client = require("../postgres");
async function deleteChildComments(id) {
  const checkChild = await client.query(
    `select * from comment where parent_comment_id = $1`,
    [id]
  );
  if (checkChild.rows.length > 0) {
    for (const val of checkChild.rows) {
      await deleteChildComments(val.id);
    }
  }
  const check = await client.query(`DELETE FROM comment where id = $1`, [id]);
}

router.get("/:id", async function (req, res, next) {
  const check = await client.query(
    `select c.id, c.content, c.parent_comment_id, u.nickname, c.user_id from comment c inner join reddit_user u on u.id = c.user_id where post_id = $1 order by c.id DESC`,
    [req.params.id]
  );
  toRemove = [];
  check.rows.forEach((com, id, obj) => {
    if (com.parent_comment_id) {
      const index = check.rows.map((e) => e.id).indexOf(com.parent_comment_id);
      if (!check.rows[index].child) check.rows[index].child = [];
      check.rows[index].child.push(com);
      toRemove.push(com);
    }
  });
  check.rows = check.rows.filter((item) => !toRemove.includes(item));
  return res.send(check.rows);
});
router.delete("/:id", async function (req, res, next) {
  const check = await client.query(`select * from comment where id = $1`, [
    req.params.id,
  ]);
  await deleteChildComments(req.params.id);
  const io = req.app.get("socketio");
  io.emit(`post/${check.rows[0].post_id}/remove`, check.rows);
  return res.send(check.rows);
});
router.post("/:id", async function (req, res, next) {
  const check = await client.query(
    `insert into comment (content, parent_comment_id, user_id, post_id) values ($1, $2, $3, $4) RETURNING *`,
    [req.body.content, req.body.parent, req.user.id, req.params.id]
  );
  const getComment = await client.query(
    `select c.id, c.content, c.parent_comment_id, c.user_id, u.nickname from comment c inner join reddit_user u on u.id = c.user_id where c.id = $1`,
    [check.rows[0].id]
  );
  const getPost = await client.query(`select * from post where id = $1`, [
    req.params.id,
  ]);
  const io = req.app.get("socketio");
  io.emit(`post/${req.params.id}/new`, getComment.rows);
  let body = { comment: getComment.rows[0], post: getPost.rows[0] };
  //io.emit(`user/${getPost.rows[0].user_id}/new`, body);
  io.emit(`${getPost.rows[0].user_id}`, body);
  return res.send(check.rows);
});

module.exports = router;
