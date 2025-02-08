import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      city,
      state,
      address,
      phoneNumber,
      userRole
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      city,
      state,
      address,
      phoneNumber,
      userRole
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (userId) => {
  try {
      const user = await User.findById(userId).select('-password'); // Exclude the password field
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      return user;
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
  }
};

/* UPDATE USER */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      city,
      state,
      address,
      phoneNumber,
      userRole
    } = req.body;

    const updateData = {
      firstName,
      lastName,
      email,
      city,
      state,
      address,
      phoneNumber,
      userRole
    };

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* RESET PASSWORD */
export const resetPassword = async (req, res) => {
  try {
    const { userId, email, password, confirmPassword } = req.body;

    // Validate password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Find the user by ID and email
    const user = await User.findOne({ _id: userId, email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate new password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Update user's password
    user.password = passwordHash;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};