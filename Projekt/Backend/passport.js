const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var client = require("./postgres");
const bcrypt = require("bcrypt");
passport.initialize();
passport.use(
  new LocalStrategy(
    {
      usernameField: "nickname",
      passwordField: "password",
    },
    async function (nickname, password, done) {
      const re = await client.query(
        `SELECT * from reddit_user where nickname = $1`,
        [nickname]
      );
      const checkAdmin = await client.query(
        "select * from user_role where user_id = $1 and role_id = 2 limit 1",
        [re.rows[0].id]
      );
      if (checkAdmin.rows.length > 0) {
        re.rows[0].role = "admin";
      }
      if (re.rows.length === 0) {
        return done(null, false, { message: "Incorrect username." });
      }
      const user = re.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return done(null, false, { message: "Incorrect password." });
      }
      if (user.activation_guid) {
        return done(null, false, { message: "User not activated." });
      }
      delete user.activation_guid;
      return done(null, user);
    }
  )
);
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "secret",
    },
    async (jwtPayload, cb) => {
      const res = await client.query(
        "select * from reddit_user where nickname = $1",
        [jwtPayload.nickname]
      );
      if (
        res.rows.length === 0 ||
        res.rows[0].password !== jwtPayload.password
      ) {
        return cb("Invalid username or password");
      }
      return cb(null, res.rows[0]);
    }
  )
);
module.exports = passport;
