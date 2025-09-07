import pool from "../config/postgredb.js"; 
import crypto from 'crypto';
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import dotenv from "dotenv";
import { sendVerificationEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail } from "../utils/emails.js";

dotenv.config();

// Helper function to update the 'updated_at' timestamp
const updateTimestamp = async (userId) => {
    await pool.query('UPDATE users SET updated_at = NOW() WHERE user_id = $1', [userId]);
};

export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Role-based email validation
        if (role !== "Recruiter") {
            if (!email.endsWith('@iitbhilai.ac.in')) {
                return res.status(400).json({ success: false, message: 'Only IIT Bhilai emails are allowed for this role' });
            }
        }

        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        const verificationToken = Math.floor(100000 + (Math.random() * 900000)).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user) {
            // If user exists but is not verified, update their info and resend verification
            if (user.is_verified) {
                return res.status(400).json({ success: false, message: "User already exists and is verified" });
            }

            const verificationTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

            const updateUserQuery = `
                UPDATE users 
                SET full_name = $1, password_hash = $2, verification_token = $3, verification_token_expires_at = $4, updated_at = NOW()
                WHERE user_id = $5
                RETURNING user_id`;
            
            const updatedUser = await pool.query(updateUserQuery, [name, hashedPassword, verificationToken, verificationTokenExpiresAt, user.user_id]);
            
            await sendVerificationEmail(user.email, verificationToken);
            return res.status(200).json({ success: true, userId: updatedUser.rows[0].user_id });
        }

        // Create a new user if one doesn't exist
        const verificationTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        const insertUserQuery = `
            INSERT INTO users (full_name, email, role, password_hash, verification_token, verification_token_expires_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING user_id`;

        const newUser = await pool.query(insertUserQuery, [name, email, role, hashedPassword, verificationToken, verificationTokenExpiresAt]);
        
        await sendVerificationEmail(email, verificationToken);
        res.status(201).json({ success: true, userId: newUser.rows[0].user_id });

    } catch (e) {
        console.error("Error in signup controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

export const sendCodeAgain = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ success: false, message: 'Missing Details' });

        const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
        if (userResult.rowCount === 0) return res.status(400).json({ success: false, message: 'Invalid Details' });
        
        const user = userResult.rows[0];
        const verificationToken = Math.floor(100000 + (Math.random() * 900000)).toString();
        const verificationTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        await pool.query(
            'UPDATE users SET verification_token = $1, verification_token_expires_at = $2, updated_at = NOW() WHERE user_id = $3',
            [verificationToken, verificationTokenExpiresAt, userId]
        );

        await sendVerificationEmail(user.email, verificationToken);
        res.status(200).json({ success: true, message: 'New verification code sent' });

    } catch (e) {
        console.error("Error in sendCodeAgain controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { userId, code } = req.body;
        if (!userId || !code) return res.status(400).json({ success: false, message: 'Missing Details' });

        const query = `
            UPDATE users 
            SET is_verified = TRUE, verification_token = NULL, verification_token_expires_at = NULL, updated_at = NOW()
            WHERE user_id = $1 AND verification_token = $2 AND verification_token_expires_at > NOW()
            RETURNING user_id, full_name, email, role`;
        
        const result = await pool.query(query, [userId, code.toString()]);

        if (result.rowCount === 0) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
        }

        const verifiedUser = result.rows[0];
        const token = generateTokenAndSetCookie(verifiedUser.user_id, res);

        const userData = {
            _id: verifiedUser.user_id,
            name: verifiedUser.full_name,
            email: verifiedUser.email,
            role: verifiedUser.role,
        };

        res.status(200).json({ success: true, message: "Email verified successfully", userData, token });

    } catch (e) {
        console.error("Error in verifyEmail controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rowCount === 0) return res.status(400).json({ message: "Invalid email or password" });
        
        const user = userResult.rows[0];
        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid email or password" });

        if (!user.is_verified) {
            return res.status(400).json({ success: false, userId: user.user_id, message: "Email is not verified" });
        }

        const token = generateTokenAndSetCookie(user.user_id, res);
        const userData = {
            _id: user.user_id,
            name: user.full_name,
            email: user.email,
            role: user.role,
        };

        res.status(200).json({ success: true, userData, token });

    } catch (e) {
        console.log("error in login controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (e) {
        console.log("error in logout controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Missing Details' });

        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rowCount === 0) return res.status(400).json({ success: false, message: 'User not found' });
        
        const user = userResult.rows[0];
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        await pool.query(
            'UPDATE users SET reset_password_token = $1, reset_password_token_expires_at = $2, updated_at = NOW() WHERE user_id = $3',
            [resetToken, resetTokenExpiresAt, user.user_id]
        );

        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await sendPasswordResetEmail(user.email, resetURL);

        res.status(200).json({ success: true, message: "Password reset link sent to your email" });

    } catch (e) {
        console.log("error in forgotPassword controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!token || !password) return res.status(400).json({ success: false, message: 'Missing Details' });

        const hashedPassword = await bcrypt.hash(password, 12);
        
        const query = `
            UPDATE users 
            SET password_hash = $1, reset_password_token = NULL, reset_password_token_expires_at = NULL, updated_at = NOW()
            WHERE reset_password_token = $2 AND reset_password_token_expires_at > NOW()
            RETURNING email`;
        
        const result = await pool.query(query, [hashedPassword, token]);

        if (result.rowCount === 0) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
        }

        const userEmail = result.rows[0].email;
        await sendPasswordResetSuccessEmail(userEmail);

        res.status(200).json({ success: true, message: 'Password reset successful' });

    } catch (e) {
        console.log("error in resetPassword controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};