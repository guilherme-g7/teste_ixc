import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import {connectToDatabase} from "./database";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/datetime', (req, res) => {
    const currentDatetime = new Date();
    res.json({ datetime: currentDatetime });
});

app.use('/', routes);

async function startServer() {
    try {
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
}
startServer();

