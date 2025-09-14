import fs from 'node:fs';
import colors from 'colors';
import bootcamp from './models/bootcamp.ts';
import course from './models/course.ts';
import user from './models/user.ts';
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URL_LOCAL);
        const conn = await mongoose.connect(process.env.MONGO_URL_LOCAL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB();

const bootcampsJson = fs.readFileSync(new URL('./data/bootcamps.json', import.meta.url), 'utf-8');
const bootcamps = JSON.parse(bootcampsJson);

const coursesJson = fs.readFileSync(new URL('./data/courses.json', import.meta.url), 'utf-8');
const courses = JSON.parse(coursesJson);

const usersJson = fs.readFileSync(new URL('./data/users.json', import.meta.url), 'utf-8');
const users = JSON.parse(usersJson);

const importData = async () => {
    try {
        await bootcamp.create(bootcamps);
        await course.create(courses);
        await user.create(users);
        console.log(colors.green('Data imported successfully'));
        process.exit();
    } catch (error) {
        console.error(colors.red(error.message));
    }
};

const deleteData = async () => {
    try {
        await bootcamp.deleteMany();
        await course.deleteMany();
        await user.deleteMany();
        console.log(colors.green('Data deleted successfully'));
        process.exit();
    } catch (error) {
        console.error(colors.red(error.message));
    }
};

if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData();
}