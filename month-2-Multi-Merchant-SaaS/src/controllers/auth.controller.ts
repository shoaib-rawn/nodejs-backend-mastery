import { Request, Response } from "express";
import { prisma } from "../config/prisma.config";
import { comparePassword } from "../utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt";
import { env } from "../config/env";

/* ==========================================================
   LOGIN
   Flow:
   1. Validate Input
   2. Find User
   3. Verify Password
   4. Generate Tokens
   5. Save Refresh Token
   6. Set Cookie
   7. Return Response
========================================================== */

export async function login(req: Request, res: Response) {
  try {
    // 1. Get Input
    const { email, password } = req.body;

    // 2. Validate
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password.",
      });
    }

    // 3. Find User
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password.",
      });
    }

    // 4. Verify Password
    const isCorrect = await comparePassword(password, user.password);

    if (!isCorrect) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password.",
      });
    }

    // 5. Generate Tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // 6. Save Refresh Token in Database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // 7. Store Refresh Token in Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 8. Return Response
    return res.status(200).json({
      status: "success",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

/* ==========================================================
   REFRESH TOKEN
   Flow:
   1. Get Refresh Token
   2. Verify JWT
   3. Check Database
   4. Reuse Detection
   5. Find User
   6. Generate New Tokens
   7. Token Rotation
   8. Update Cookie
   9. Return New Access Token
========================================================== */

export async function refresh(req: Request, res: Response) {
  try {
    // 1. Get Refresh Token
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        status: "fail",
        message: "Refresh token missing.",
      });
    }

    // 2. Verify JWT
    const decoded: any = verifyToken(
      refreshToken,
      env.JWT_REFRESH_SECRET
    );

    // 3. Check Database
    const activeToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    // 4. Reuse Detection
    if (!activeToken) {
      await prisma.refreshToken.deleteMany({
        where: {
          userId: decoded.userId,
        },
      });

      res.clearCookie("refreshToken");

      return res.status(403).json({
        status: "fail",
        message: "Refresh Token Reuse Detected.",
      });
    }

    // 5. Find User
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User not found.",
      });
    }

    // 6. Generate New Tokens
    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    // 7. Token Rotation
    await prisma.refreshToken.delete({
      where: {
        id: activeToken.id,
      },
    });

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // 8. Update Cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 9. Return New Access Token
    return res.status(200).json({
      status: "success",
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

/* ==========================================================
   LOGOUT
   Flow:
   1. Get Refresh Token
   2. Delete Session From DB
   3. Clear Cookie
   4. Return Success
========================================================== */

export async function logout(req: Request, res: Response) {
  try {
    // 1. Get Refresh Token
    const { refreshToken } = req.cookies;

    // 2. Delete Session
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: {
          token: refreshToken,
        },
      });
    }

    // 3. Clear Cookie
    res.clearCookie("refreshToken");

    // 4. Success
    return res.status(200).json({
      status: "success",
      message: "Logged out successfully.",
    });

  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}