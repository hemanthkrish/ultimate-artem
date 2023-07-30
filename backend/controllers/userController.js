const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwttoken");
const sendEmail = require("../utils/sendEmail");

//Register a user-----
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id ",
      url: "this is a sample url",
    },
  });
  sendToken(user, 201, res);
});

//Login User
exports.userLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //checking if the user has given both email and password
  if (!email || !password) {
    return next(new ErrorHandler("please enter Email and Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("invalid email or password", 401));
  }
  const isPassordMatched = await user.comparePassword(password);

  if (!isPassordMatched) {
    return next(new ErrorHandler("invalid email or password", 401));
  }
  sendToken(user, 200, res);
  //instead of this we have used the aboue line
  // const token = user.getJWTToken();
  // res.status(200).json({
  //   success: true,
  //   token,
  // });
});

//get all users

exports.getUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

exports.userLogout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logged out",
  });
});

//forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  //get reset password token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not
  requested this email then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `ecommerce password recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} sent successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//reset password

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //create token hack
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler("reset password token is not valid or expired", 404)
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});
