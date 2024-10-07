const User = require("../models/User.js");
const bcrypt = require("bcryptjs")
// List all users
exports.listUsers = async (req, res) => {
  const userDetails = await User.findById(Object.values(req.user)[0].id);
  //   console.log(userDetails); // DBug
  if (!userDetails || !userDetails.admin) {
    return res.status(403).json({ msg: "Access denied. Admins only." });
  }

  try {
    const users = await User.find().select("-password -otp");
    // console.log(users); // DBug
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// update the User
exports.updateUser = async (req, res) => {
  const { name, phone, address, password, confirmPassword, email} = req.body;

  // Allowed fields
  const allowedFields = [
    "name",
    "phone",
    "address",
    "password",
    "confirmPassword",
  ];

  // Get keys from request body
  const requestBodyKeys = Object.keys(req.body);

  // Check if all keys are allowed
  const isValidUpdate = requestBodyKeys.every((key) =>
    allowedFields.includes(key)
  );

  if (!isValidUpdate) {
    return res.status(400).json({
      msg: "You can only update: name, phone, address, password, confirmPassword",
    });
  }
  if (password) {
    // verify password
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "confirmPassword is not matching" });
    }

    // Validate password (at least 8 characters, one uppercase letter, one symbol)
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters long, contain one uppercase letter, and one symbol",
      });
    }
  }

  if (email) {
    return res.status(404).json({ msg: "Email is not allowed to change" });
  }

  const userId = Object.values(req.user)[0].id;
  // console.log(userId); DBug
  try {
    // Find the user by their authenticated ID
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update only the authenticated user's details
    user.name = name || user.name;
    user.password = password || user.password;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    // Password validation
    if (password) {
      const isLongEnough = password.length >= 8;
      const hasUppercase = [...password].some(
        (char) => char >= "A" && char <= "Z"
      );
      const hasSymbol = [...password].some((char) => "!@#$%^&*".includes(char));

      if (!isLongEnough || !hasUppercase || !hasSymbol) {
        return res.status(400).json({
          msg: "Password must be at least 8 characters long, contain one uppercase letter, and one symbol",
        });
      }

      // Hash the new password before saving
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // only details to be displayed
    const UserName = user.name || name
    const UserPhone = user.phone || phone
    const UserAddress = user.address || address
    const UserDetails = {UserName,UserPassword: password ? "Password Updated" : "your current password",UserPhone,UserAddress} 

    // Save the updated user details
    await user.save();
    res.status(200).json({ msg: "User updated successfully", UserDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const userId = Object.values(req.user)[0].id;

  try {
    // Find and delete only the authenticated user's data
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
