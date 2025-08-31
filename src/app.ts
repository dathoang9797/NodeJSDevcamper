import express from 'express';
import routerBootcamps from "#src/routers/bootcamps.ts";
import morgan from 'morgan';
// import "#src/config/db.ts";

const app = express();
const port = process.env.PORT || 3000;

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use("/api/v1/bootcamps", routerBootcamps);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
