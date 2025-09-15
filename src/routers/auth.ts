import express from 'express';
import { authController } from '#src/controllers/auth.ts';
import { protect } from '#src/middleware/auth.ts';

const { Register, Login, GetMe, ForgotPassword, UpdateDetail, UpdatePassword } = authController;
const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/forgotpassword", ForgotPassword);
router.put("/updatedetail", protect, UpdateDetail);
router.put("/updatepassword", protect, UpdatePassword);
router.get("/me", protect, GetMe);

export default router;