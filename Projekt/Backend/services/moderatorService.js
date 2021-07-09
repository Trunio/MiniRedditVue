var client = require("../postgres");
module.exports = () => {
  return async (req, res, next) => {
    if (req.method === "PUT") {
      const getId = await client.query(
        `select id from subreddit where name = $1 limit 1`,
        [req.body.oldname]
      );
      const check = await client.query(
        `select * from subreddit_moderator where user_id = $1 and subreddit_id = $2 limit 1`,
        [req.user.id, getId.rows[0].id]
      );
      if (check.rows.length === 0) {
        res.end("not a mod");
      }
    }
    next();
  };
};
