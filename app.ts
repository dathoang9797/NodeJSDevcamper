import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: './Config/Config.env' });

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});