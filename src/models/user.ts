import bcrypt from "bcryptjs";
import mongoose, { Model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

export interface IUser extends Document {
    id: string;
    name: string;
    email: string;
    role: string;
    password: string;
    resetPasswordToken: string;
    resetPasswordExpire: Date | number;
    createAt: Date;
}

export interface IUserModel extends Model<IUser> {
    getUserById(id: string): Promise<IUser | null>;
}

interface IUserMethods {
    getSignedJwtToken(): string;
    matchPassword(enteredPassword: string): Promise<boolean>;
    getResetPasswordToken(): string;
}

const UserSchema = new Schema<IUser, IUserModel, IUserMethods>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please add a valid email address",
            ]
        },
        role: {
            type: String,
            enum: ['user', 'publisher', "admin"],
            default: 'user'
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        createAt: {
            type: Date,
            default: Date.now
        },
    },
    {
        methods: {
            //Sign JWT and return
            getSignedJwtToken() {
                const secret = process.env.JWT_SECRET || "default_secret";
                const expiresIn = (process.env.JWT_EXPIRE || "30d") as jwt.SignOptions["expiresIn"];
                return jwt.sign({ id: this._id }, secret, { expiresIn });
            },
            async matchPassword(enteredPassword: string) {
                const isMatch = await bcrypt.compare(enteredPassword, this.password);
                return isMatch;
            },
            getResetPasswordToken() {
                //Generate token
                const resetToken = crypto.randomBytes(20).toString("hex");

                //Hash token and set to resetPasswordToken field
                this.resetPasswordToken = crypto
                    .createHash("sha256")
                    .update(resetToken)
                    .digest("hex");

                //Set expire
                this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

                return resetToken;
            }
        },
        statics: {
            //Static method to get user by id
            async getUserById(id: string) {
                return this.findById(id);
            }
        }
    });

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
