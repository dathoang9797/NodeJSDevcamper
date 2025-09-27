import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const connectDB = async () => {
    try {
        console.log({ URL_MONGO: process.env.MONGO_URL });
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB();
