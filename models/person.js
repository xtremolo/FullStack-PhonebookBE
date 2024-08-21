const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

// TODO how about id?
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// TODO transform schema's toJSON ?
// BUG
// [x]
// []
// FIXME
// HACK
// XXX

module.exports = mongoose.model("Person", personSchema);
