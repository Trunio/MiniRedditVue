var client = require("../postgres");
module.exports = () => {
  return async (req, res, next) => {
    if (req.method === "DELETE") {
      const getPost = await client.query(
        `select * from post where id = $1 limit 1`,
        [req.url.substring(1)]
      );
      const checkMod = await client.query(
        `select * from subreddit_moderator where user_id = $1 and subreddit_id = $2 limit 1`,
        [req.user.id, getPost.rows[0].id]
      );
      if (getPost.rows[0].user_id === req.user.id || checkMod.rows.length > 0) {
      } else {
        res.end("no authorization");
      }
    }
    next();
  };
};
