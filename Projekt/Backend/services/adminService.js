var client = require("../postgres");
module.exports = () => {
  return async (req, res, next) => {
    if (req.url === "/all" || req.url.startsWith("/ban")) {
      const checkAdmin = await client.query(
        "select * from user_role where user_id = $1 and role_id = 2 limit 1",
        [req.user.id]
      );
      if (checkAdmin.rows.length === 0) {
        res.end("not an admin");
      }
    }
    next();
  };
};
