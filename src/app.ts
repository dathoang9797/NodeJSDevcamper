import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routerBootcamps from "#src/routers/bootcamps.ts";

dotenv.config({ path: './config/config.env' });

const app = express();
const port = process.env.PORT || 3000;

app.use("/api/v1/bootcamps", routerBootcamps);

app.use(express.json());
app.use(morgan("dev"));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});