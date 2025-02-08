import express from "express";
import { getAllUsers, deleteUserById  } from "../controllers/general.js";

const router = express.Router();

router.get("/all_users", getAllUsers);
router.delete("/deleteUser/:id", deleteUserById);

export default router;