const express = require("express");
const router = express.Router();
const User = require("../schemas/userSchema");

// login in account
router.get("/login", async (req, res) => {
  let new_user;

  try {
    new_user = await User.find({ email: req.body.email });
    if (
      new_user[0].password == req.body.password &&
      req.body.password !== undefined
    ) {
      res.status(201).json({ message: "success" });
    } else {
      res.status(404).json({ message: "incorrect password" });
    }
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
});

// add new user 
router.post("/", async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const new_user = await user.save();

    res.status(201).json({
      user: { _id: new_user.id, email: new_user.email },
    });

    console.log(`user ${new_user.email} added`);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
