let mongoose = require("mongoose");
let SChema = mongoose.Schema;

let userSchema = new SChema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  github: {
    name: { type: String },
    username: { type: String },
  },
  google: {
    name: { type: String },
  },
  providers: [String],
});

let bcrypt = require("bcrypt");

userSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err);
      this.password = hashed;
      return next();
    });
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};
module.exports = mongoose.model("User", userSchema);
