import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectToDatabase } from './database';

const app = express();
const PORT = 3000;
const startServer = async () => {
    await connectToDatabase();

    const server = express();

    server.use(bodyParser.json());
    server.use(cors());

    server.use('/api', app);

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();