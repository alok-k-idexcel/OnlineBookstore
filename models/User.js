const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  cart: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      quantity: { type: Number, default: 1 },
    },
  ],
  admin: { type: Boolean, default: false },
  token: { type: String },
  adminToken: { type: String },
  otp: { type: String },
  myBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  address: { type: String, default: "" },
  otpAttempts: { type: Number },
  quantity: { type: Number, default: 1 },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
