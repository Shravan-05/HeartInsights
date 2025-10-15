const mongoose = require("mongoose");
const { Schema } = mongoose;
const feedback = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  msg: {
    type: String,
    require: true,
    unique: true,
  },
});
const Feedback = mongoose.model("feedback",feedback);
module.exports = Feedback;
