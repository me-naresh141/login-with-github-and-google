let passport = require("passport");
var GitHubStrategy = require("passport-github").Strategy;
var GoogleStrategy = require("passport-google-oauth20").Strategy;
let User = require("../models/user");
// github strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      let github_profile_Data = {
        email: profile._json.email,
        github: {
          name: profile._json.name,
          username: profile.username,
        },
        providers: [profile.provider],
      };

      User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return cb(err);
        if (!user) {
          User.create(github_profile_Data, (err, addedUser) => {
            console.log(addedUser);
            if (err) return cb(err);
            cb(null, addedUser);
          });
        } else {
          user.providers.push(profile.provider);
          User.findOneAndUpdate(
            { email: profile._json.email },
            github_profile_Data,
            (err, user) => {
              cb(null, user);
            }
          );
        }
      });
    }
  )
);

// google strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      let google_profile_Data = {
        email: profile._json.email,
        google: {
          name: profile._json.name,
        },
        providers: [profile.provider],
      };

      User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return cb(err);
        if (!user) {
          User.create(google_profile_Data, (err, addedUser) => {
            if (err) return cb(err);
            cb(null, addedUser);
          });
        } else {
          user.providers.push(profile.provider);
          User.findOneAndUpdate(
            { email: profile._json.email },
            user,
            (err, user) => {
              cb(null, user);
            }
          );
        }
      });
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    cb(err, user);
  });
});
