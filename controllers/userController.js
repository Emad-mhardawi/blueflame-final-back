const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const Order = require("../models/orderModel");
const crypto = require("crypto");

// initialize nodemailer transporter
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SEND_GRID_KEY,
    },
  })
);

//@ route: POST/  /register
//@ description: add new user
//@ access: public
exports.postRegisterUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, confirmedPassword } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("email is required");
  }
  if (!password || password.length < 6) {
    res.status(400);
    throw new Error(
      "password is required and have to be at least 6 characters long"
    );
  }
  if (password !== confirmedPassword) {
    res.status(400);
    throw new Error("password dose not match");
  }

  if (!username) {
    username = email;
  }

  const userExist = await User.findOne({ email: email });

  if (userExist) {
    res.status(400);
    throw new Error("user already exists");
  }

  const hashedPassword = (await bcrypt.hash(password, 12)).toString();

  const user = await User.create({
    username: username,
    email: email,
    password: hashedPassword,
  });

  if (user) {
    const sendmail = await transporter.sendMail({
      to: user.email,
      from: "emad.mhardawi@chasacademy.se",
      subject: "Signup succeeded!",
      html: "<h1> you successfully signed up </h1>",
    });
    res.status(200).json({
      username: user.username,
    });
  } else {
    res.status(400);
    throw new Error("invalid user data, something went wrong");
  }
});

//@ route: POST/  /login
//@ description: Auth user & get JWT
//@ access: public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("no account is attached with this email");
  }

  //check if the provided password match the password in the database
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (user && passwordMatch) {
    res.json({
      _id: user._id,
      name: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("invalid email or password");
  }
});

//@ route: GET/  /profile
//@ description: get user data
//@ access: private
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("user not fount");
  }
});

//@ route: PUT /profile
//@ description: update user profile
//@ access: private
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const hashedPassword = (
        await bcrypt.hash(req.body.password, 12)
      ).toString();
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("some thing went wrong");
  }
});

//@ route: GET /user/orders
//@ description: Get all orders
//@ access: private
exports.getUserOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  if (orders) {
    res.send(orders);
  }
});

//@ route: Post /forgotPassword
//@ access: public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    res.status(400);
    throw new Error("please provide an email");
  }
  //1 Get user based on posted email
  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }

  //2 generate the random reset token
  const resetToken = await crypto.randomBytes(32).toString("hex");

  user.passwordResetToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetExpires = (await Date.now()) + 10 * 60 * 1000;

  user.save();

  //3 Send it to user email
  const resetUrl = await `http://localhost:3000/resetPassword?resetToken=${resetToken}`;
  const sendmail = await transporter.sendMail({
    to: user.email,
    from: "emad.mhardawi@chasacademy.se",
    subject: "password reset!",
    html: `
    <h3>blue flame reset password</h3>
    <P> forgot your password ? please follow this link to reset your password </P>
    ${resetUrl}
    this link will be valid for only 10 minutes
    `,
  });

  if (sendmail) {
    res.status(200).json({
      message: "we have sent a reset password link to your email",
    });
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {

  const { password, confirmedPassword} = req.body;
  const resetToken = req.query.resetToken;

  
  if (!password || password.length < 6) {
    res.status(400);
    throw new Error(
      "password is required and have to be at least 6 characters long"
    );
  }

  if (password !== confirmedPassword) {
    res.status(400);
    throw new Error("password dose not match");
  }

  
  // 1- get user based on the token
const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

const user = await User.findOne({
  passwordResetToken: hashedToken,
  passwordResetExpires: {$gt: Date.now()}
})

if(!user){
  res.json({message: 'your link has expired'})
}

if(user){
  const hashedPassword = (await bcrypt.hash(password, 12)).toString();
  res.json({message: 'you have reset your password successfully'})
  user.password = hashedPassword
 user.passwordResetToken = undefined
 user.passwordResetExpires=undefined
 user.save()
}
 // 2- if token has not expired, and there is a user set new password
 
 
});
