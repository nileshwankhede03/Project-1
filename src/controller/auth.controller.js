const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerController(req, res) {
  const { email, username, password, bio, profileImage } = req.body;

  const isUserAlreaduExists = await userModel.findOne({
    $or: [
      // array magto and 1 condition satisfy zali trr return karto data
      { username }, // condition 1
      { email }, // condition 2
    ],
  });

  if (isUserAlreaduExists) {
    return res.status(409).json({
      message:
        'User already exists' +
        (isUserAlreaduExists.email === email
          ? 'Email already exists'
          : 'username already exists'),
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    bio,
    profileImage,
    password: hash,
  });

  // token creation with signature
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
  );

  // set token in cookie
  res.cookie('token', token);

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      email: user.email,
      username: user.username,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

async function loginController(req, res) {
  const { email, username, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ email: email }, { username: username }],
  });

  // console.log(isUserEmailExists)
  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    });
  }

  // pass decryption means compare
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401).json({
      message: 'password is invalid',
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
  );

  res.cookie('token', token);

  res.status(200).json({
    message: 'User loggedIn successfully',
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

async function getMeController(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId);

  res.status(200).json({
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

module.exports = {
  registerController,
  loginController,
  getMeController,
};
