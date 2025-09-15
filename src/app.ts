import express from 'express';
import path from 'path';
import routerBootcamps from "#src/routers/bootcamps.ts";
import routerCourses from "#src/routers/courses.ts";
import routerAuth from "#src/routers/auth.ts";
import routerUsers from "#src/routers/users.ts";
import morgan from 'morgan';
import errorHandler from './middleware/error.ts';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import "#src/config/index.ts";

const app = express();
const port = process.env.PORT || 3000;

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

//File uploading
app.use(fileUpload());

//static folder
app.use(express.static(path.join(process.cwd(), 'public')));

app.set('query parser', 'extended');

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

app.use("/api/v1/bootcamps", routerBootcamps);
app.use("/api/v1/courses", routerCourses);
app.use("/api/v1/auth", routerAuth);
app.use("/api/v1/users", routerUsers);
app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on("unhandledRejection", (err: Error) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});