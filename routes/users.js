const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validateUser } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get('/me', auth, async (req, res)=>{
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
})

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
//Joi password complexity --- requirements symbols/uppercase letters

const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(user.password, salt); 

  //Or with Lodash
  //pulling propertie from req.body

//   user = new User(_.pick(req.body, ['name', 'email', 'password']))


  await user.save();
  
  //Dont want to send the password back to the user
  
//   res.send({
//       name: user.name,
//       email: user.email
//   });

const token = user.generateAuthToken();
//lodash --- picking certain properties and creating a new object
 res.header("x-auth-token", token).send(_.pick(user, ['_id', 'name', 'email']))

});

module.exports = router;
