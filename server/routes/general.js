import express from "express";
import { getUser, SaveChildInfo, getChildren, generateExcel, getMonthlyData, getChildInfoBMIData, getDashboardStats } from "../controllers/general.js";

const router = express.Router();

router.get("/user/:id", getUser);
router.post("/add_child_Info", SaveChildInfo);
router.get("/children", getChildren);
router.get('/generate-excel', generateExcel);
router.get('/monthly-data', getMonthlyData);
router.get('/bmi-data', getChildInfoBMIData);
router.get('/dashboardStat', getDashboardStats);

export default router;
