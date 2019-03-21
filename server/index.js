const express = require("express");
const history = require("connect-history-api-fallback");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");

// Getting the local authentication type
const LocalStrategy = require("passport-local").Strategy;

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
  PORT = 3000,
  NODE_ENV = "development",
  SESS_NAME = "SID",
  SESS_LIFETIME = TWO_HOURS,
  SESS_SECRET = "this is a secret!"
} = process.env;

const IN_PROD = NODE_ENV === "production";

// Creating an express instance
const app = express();

app.use(history());
app.use(bodyParser.json());

app.use(
  session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: true,
      secure: IN_PROD
    }
  })
);

app.use(express.static("./dist"));

app.use(passport.initialize());

app.use(passport.session());

const authMiddleware = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).send("You are not authenticated");
  } else {
    return next();
  }
};

let users = [
  {
    id: 1,
    name: "Jude",
    email: "user@email.com",
    password: "password",
    is_admin: 1
  },
  {
    id: 2,
    name: "Emma",
    email: "emma@email.com",
    password: "password2",
    is_admin: 0
  }
];

app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).send([user, "Cannot log in", info]);
    }

    req.login(user, () => {
      res.send("Logged in");
    });
  })(req, res, next);
});

app.get("/api/logout", (req, res) => {
  req.logout();
  console.log("Logged out");

  return res.send();
});

app.post("/api/auth", authMiddleware, (req, res) => {
  let user = users.find(user => {
    return user.id === req.session.passport.user;
  });
  res.send({ user });
});

app.get("/api/user", authMiddleware, (req, res) => {
  let user = users.find(user => {
    return user.id === req.session.passport.user;
  });

  console.log([user, req.session]);

  res.send({ user });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    (username, password, done) => {
      let user = users.find(user => {
        return user.email === username && user.password === password;
      });

      if (user) {
        done(null, user);
      } else {
        done(null, false, { message: "Incorrect username or password" });
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  let user = users.find(user => {
    return user.id === id;
  });

  done(null, user);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
