const User = require("../model/UserModel");
const bcrypt = require("bcryptjs");

module.exports.register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    const userheck = await User.findOne({ userName });
    if (userheck) {
      return res.json({ msg: "Username already used", status: false });
    }

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: "Email already used", status: false });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName,
      email,
      password: hashPassword,
    });
    delete user.password;

    return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });
    if (!user) {
      return res.json({
        msg: "Incorrect UserName",
        status: false,
      });
    }

    const ispasswordValid = await bcrypt.compare(password, user.password);
    if (!ispasswordValid) {
      return res.json({
        msg: "Incorrect Password",
        status: false,
      });
    }
    delete user.password;

    return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });

    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "userName",
      "avatarImage",
      "_id",
    ]);

    return res.json({
      users,
    });
  } catch (error) {
    next(error);
  }
};
