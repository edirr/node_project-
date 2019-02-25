
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Genre , validateGenre } = require("../models/genre")
const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();


router.get("/", async (req, res) => {
  // throw new Error('Could not get the genres.')
  //error handing done by express-async-errors
  //runs error function automatically
  
    const genres = await Genre.find().sort("name");
    res.send(genres);


  //instead of creating error middleware

  // try{
  //   const genres = await Genre.find().sort("name");
  //   res.send(genres);
  // }
  // catch(e){
  //   next(e);
  // }
 
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });
  await genre.save();

  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true
    }
  );

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.delete("/:id",[auth, admin], async (req, res) => {
  
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

module.exports = router;
