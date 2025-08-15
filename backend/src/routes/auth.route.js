import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import passport from "passport";

import { signup, login, logout, updateProfile, checkAuth, forgotPassword, resetPassword, changePassword } from "../controller/auth.controller.js";

const router = express.Router();

// Regular auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword);
router.post("/changepassword", protectRoute, changePassword)

// Google OAuth start
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login", session: false }),
  async (req, res) => {
    try {
      const profile = req.user;

      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        // Create new user with random password to satisfy schema
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          fullName: profile.displayName,
          profilePic: profile.photos[0]?.value || "",
          password: Math.random().toString(36).slice(-8), // random 8-char password
        });
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Set cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Redirect to frontend
      res.redirect("http://localhost:5173/");

    } catch (error) {
      console.log("Google OAuth callback error:", error);
      res.redirect("http://localhost:5173/login");
    }
  }
);

export default router;
