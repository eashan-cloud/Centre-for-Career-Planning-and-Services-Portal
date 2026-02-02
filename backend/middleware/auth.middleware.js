// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import User from "../models/user.model.js";
// import CallLog from "../models/callLog.model.js"; // CallLog uses Postgres, commenting out to prevent crash

config();

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log("Token: ", token);

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized. Token not found" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Handle token errors separately
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    // console.log("Decoded Token: ", decoded);

    if (!decoded?.userId) {
      return res.status(401).json({ success: false, message: "Not Authorized. Token invalid" });
    }

    // Fetch user from MongoDB
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    req.userId = user._id; 
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  };
};


// HR/CallLog Logic uses Postgres, temporarily disabling/simplifying to prevent crashes if used.
export const authorizeUpdateLog = async (req, res, next) => {
  return res.status(503).json({ success: false, message: "Feature temporarily unavailable due to missing database configuration." });
  /*
  try {
    const log = await CallLog.getLogById(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: "Log not found" });
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.user_id === log.caller_id;
    const iseligibleOwner = req.user.user_id === log.caller_id && log.call_timestamp > Date.now() - 24*60*60*1000;

    if( isAdmin || iseligibleOwner ){
      next();
    }
    else if(isOwner){
      return res.status(403).json({ success: false, message: "You can modify within only 24Hrs" });
    }
    else{
      return res.status(403).json({ success: false, message: "Access denied" });
    }
  } catch (error) {
    console.error("Error in authorizeUpdateLog middleware: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  */
};