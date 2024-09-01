import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";


const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();
    return res
      .status(201)
      .json({ status: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "user is not registered" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json({ message: "password is not correct" });
  }

  const token = jwt.sign({ username: user.username }, process.env.KEY, {
    expiresIn: "1h",
  });
  res.cookie("token", token, { maxAge: 36000 });
  return res
    .status(200)
    .json({ status: true, message: "User logged in successfully" });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User is not registered" });
    }
    const token = jwt.sign({ username: user.username }, process.env.KEY, {expiresIn:'5m'})


  //  var nodemailer = require("nodemailer");

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kevk0758@gmail.com",
        pass:process.env.PASSWORD,
      },
       // Increase the timeout settings
  socketTimeout: 60000, // 60 seconds
  connectionTimeout: 60000, // 60 seconds
    });

    var mailOptions = {
      from: "kevk0758@gmail.com",
      to: email,
      subject: "reset password",
      text: `http://localhost:5173/resetpassword/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({status: true, message:"error during sending email "})
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (err) {
    console.error(err);
  }
});

// router.post("/reset-password", async(req,res) => {
//   const {token} = req.params.token;
//   const {password} = req.body;

//   try {
//     const decoded = jwt.verify(token,process.env.KEY);
//     const id = decoded.id;

//     const hashPassword = await bcrypt.hash(password,10)
//     const user = await User.findByIdAndUpdate(id, { password: hashPassword }, { new: true });
//     return res.json({status:true,message:"password is updated"})
    

//   } catch(err) {
//     return res.json("invalid token")
    
//   }


// })
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ status: false, message: "Password must be at least 6 characters long" });
  }

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const userId = decoded.id;

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(userId, { password: hashPassword }, { new: true });

    // if (!user) {
    //   return res.status(404).json({ status: false, message: "User not found" });
    // }

    return res.json({ status: true, message: "Password has been successfully reset" });

  } catch (err) {
    console.error(err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ status: false, message: "Invalid or expired token" });
    }
    return res.status(500).json({ status: false, message: "An error occurred while resetting the password" });
  }
});

export { router as authRouter };
