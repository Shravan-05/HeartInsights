const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../Middleware/Fetchuser");
const JWT_SEC = "HeartPredictdevops$dege";
const Feedback=require("../Models/Feedback");
router.post(
  "/signup",
  [
    body("role", "Role is required").notEmpty(),
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 7 characters long").isLength({ min: 7 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ errors: "User already exists", success });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        role: req.body.role,
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SEC);
      success = true;
      res.json({ success, authToken,role:user.role });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ errors: "Some error occurred", success });
    }
  }
);






router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials", success });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Invalid credentials", success });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SEC);
      success = true;
      res.json({ success, authToken,role:user.role });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occurred");
    }
  }
);


router.post("/getuser", fetchuser, async (req, res) => {
  let success = false;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    success = true;
    res.json({
      success,
      id:user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("some error occurred");
  }
});


    router.post(
  "/resetpassword",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").isLength({ min: 7 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ error: "User not found", success });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.findByIdAndUpdate(
        user._id,
        { password: secPass },
        { new: true }
      );

      success = true;
      res.json({ success, message: "Password updated successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Some error occurred");
    }
  }
);

router.post(
  "/feedback",
  [
    body("name", "Name cannot be blank").notEmpty(),
    body("email", "Enter a valid email").isEmail(),
    body("msg", "Message cannot be blank").notEmpty(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success });
    }
    try {
      const feedback = await Feedback.create({
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        msg: req.body.msg.trim(),
      });

      success = true;
      res.json({ success, message: "Feedback submitted successfully", feedback });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Some error occurred");
    }
  }
);








module.exports = router;
