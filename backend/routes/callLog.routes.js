import express from "express";
import { protectRoute , authorizeRoles , authorizeUpdateLog } from "../middleware/auth.middleware.js";
import { createCallLog, getAllCallLogs, getCallLogById, updateCallLog, deleteCallLog } from "../controllers/callLog.controller.js";

const router = express.Router();

// Routes
router.post("/", protectRoute, createCallLog);       // Create new log
router.get("/", protectRoute, getAllCallLogs);       // Get all logs
router.get("/:id", protectRoute, getCallLogById);    // Get single log
router.put("/:id", protectRoute, authorizeUpdateLog, updateCallLog);     // Update log
router.delete("/:id", protectRoute, authorizeRoles("admin"), deleteCallLog);  // Delete log

export default router;
