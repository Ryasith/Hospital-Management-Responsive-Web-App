import express from "express";
import { login } from "../controllers/auth.js";
import { register } from "../controllers/auth.js";
import { updateUser } from "../controllers/auth.js";
import { getUserById } from "../controllers/auth.js";
import { verifyToken } from "../middleware/auth.js";
import { resetPassword } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.put("/update/:id", updateUser);
router.post("/reset_password", resetPassword);

// Add the /me route to get user details based on the token
router.get("/me", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;