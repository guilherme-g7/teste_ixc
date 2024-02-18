import mongoose, {Connection} from 'mongoose';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/teste_ixc';

let dbConnection: Connection | null = null;

async function connectToDatabase(): Promise<void> {

    if(!dbConnection) {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log(`Connected to database: ${MONGODB_URI}`);
        });

        connection.on('error', (err) => {
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

export {connectToDatabase, disconnectFromDatabase};