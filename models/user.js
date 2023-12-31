const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
});

//static signup method
userSchema.statics.signup = async function (
  name,
  username,
  email,
  password,
  ipAddress
) {
  if (!name || !username || !email || !password || !ipAddress) {
    throw Error("All fields must be filled.");
  }

  if (!validator.isEmail(email)) {
    throw Error("Invalid email");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "password must be 8+ chars, with uppercase, lowercase, number and symbol."
    );
  }

  const existedEmail = await this.findOne({ email });

  if (existedEmail) {
    throw Error("Email already in use.");
  }

  //hashing password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  //creating user
  const user = await this.create({
    name,
    username,
    email,
    password: hashPassword,
    ipAddress,
  });
  return user;
};

//static login method
userSchema.statics.login = async function (email, password, ipAddress) {
  //validation;
  if (!email || !password || !ipAddress) {
    throw Error("All fields must be filled.");
  }

  const user = await this.findOne({ email, ipAddress });

  if (!user) {
    throw Error("Incorrect email or restricted ip address");
  }

  //comparing password
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Eroor("incorrect password");
  }
  return user;
};

module.exports = mongoose.model("User", userSchema);
