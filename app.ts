import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routerBootcamp from "./Routers/Bootcamps.ts";

dotenv.config({ path: './Config/Config.env' });

const app = express();
const port = process.env.PORT || 3000;

app.use("/api/v1/bootcamps", routerBootcamp);

app.use(express.json());
app.use(morgan("dev"));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});