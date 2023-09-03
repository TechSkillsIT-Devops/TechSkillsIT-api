/* Import Express and Router */
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const Listing = require("../../models/Listing");

router.get("/", (req, res) => {
  res.send("listing / called..");
});

router.post("/add", async (req, res) => {
  const { name,sequence } = req.body;
  let listing = new Listing({
    name,sequence
  });
  listing = await listing.save();
  res.json({ listing });
});

router.get("/all", async (req, res) => {
  let listing = await Listing.find();
  listing = listing.sort((a,b)=>a.sequence - b.sequence);
  res.send(listing);
});

module.exports = router;
