import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

const authService = new AuthService();
const authController = new AuthController(authService);

const router = Router();

// POST /api/auth/login
router.post("/login", (req, res) => authController.login(req, res));

// POST /api/auth/register
router.post("/register", (req, res) => authController.register(req, res));

export default router;
