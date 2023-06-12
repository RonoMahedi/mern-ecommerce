const { generateToken } = require("../config/jwtToken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");


// const createUser = async (req,res) =>{
// try {
//     const { firstname, lastname, email, mobile } = req.body;
//     const existingUser = await User.findOne({email});
//     if (existingUser) {
//       res.status(400).json({ message: "Already register using this Email" });
//       return;
//     }
//     const hashPassword = await bcrypt.hash(req.body.password, 10);

//     const newUser = new User({
//         firstname,
//         lastname,
//         email,
//         mobile,
//       password: hashPassword,
//     });
//     const result = await newUser.save();
//     res.status(200).json({ user: result});
//   } catch (error) {
//     res.status(500).json(error);
//   }


// };

// Create a User ----------------------------------------------

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } else {
      throw new Error("User Already Exists");
    }
  });

  // Login a user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    // const refreshToken = await generateRefreshToken(findUser?._id);
    // const updateuser = await User.findByIdAndUpdate(
    //   findUser.id,
    //   {
    //     refreshToken: refreshToken,
    //   },
    //   { new: true }
    // );
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 72 * 60 * 60 * 1000,
    // });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

module.exports = {createUser,loginUser}