import User from "#src/models/user.ts";
import ErrorResponse from "#src/utils/errorResponse.ts";
import asyncHandler from "#src/middleware/async.ts";
import { sendEmail } from "#src/utils/sendEmail.ts";
import type { Request, Response, NextFunction, CookieOptions } from "express";

export const Register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    const token = user.getSignedJwtToken();
    res.status(200).json({ success: true, data: user, token });
});

export const Login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    }

    //+password to select password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendTokenResponse(user, 200, res);
});

export const Logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, data: {} });
});

export const GetMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.id);
    res.status(200).json({ success: true, data: user });
});

export const UpdateDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const fieldToUpdate = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user?.id, fieldToUpdate, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: user });
});

export const UpdatePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.id).select("+password");
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
        return next(new ErrorResponse("Current password is incorrect", 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});

export const ForgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorResponse("There is no user with that email", 404));
    }
    //Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    //Create reset url
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Password reset token",
            message
        });
        res.status(200).json({ success: true, data: "Email sent" });
    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorResponse("Email could not be sent", 500));
    }
});


//Get Token From model, create cookie and send response
const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
    const token = user.getSignedJwtToken();
    const options: CookieOptions = {
        expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie("token", token, options)
        .json({ success: true, data: user, token });
};