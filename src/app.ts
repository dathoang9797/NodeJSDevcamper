import express from 'express';
import routerBootcamps from "#src/routers/bootcamps.ts";
import morgan from 'morgan';
import errorHandler from './middleware/error.ts';
import "#src/config/index.ts";

const app = express();
const port = process.env.PORT || 3000;

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());
app.use("/api/v1/bootcamps", routerBootcamps);
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