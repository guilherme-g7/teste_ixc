import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/teste_ixc';

let dbConnection: Connection | null = null;

async function connectToDatabase(): Promise<void> {
    if (!dbConnection) {
        dbConnection = await mongoose.createConnection(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        dbConnection.on('connected', () => {
            console.log(`Connected to database: ${MONGODB_URI}`);
        });

        dbConnection.on('error', (err) => {
            console.error(`Error connecting to database: ${err}`);
        });
    }
}

async function disconnectFromDatabase(): Promise<void> {
    if (dbConnection) {
        await dbConnection.close();
        dbConnection = null;
    }
}

export { connectToDatabase, disconnectFromDatabase };