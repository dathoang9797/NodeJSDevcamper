import express from 'express';
import { authController } from '#src/controllers/auth.ts';
import { protect } from '#src/middleware/auth.ts';

const { Register, Login, GetMe, ForgotPassword } = authController;
const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/forgotpassword", ForgotPassword);
router.get("/me", protect, GetMe);

export default router;