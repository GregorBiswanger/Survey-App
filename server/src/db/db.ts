import { Db, MongoClient } from 'mongodb';
const connectionString = process.env.CONNECTION_STRING || 'mongodb://localhost:9090';
const client = new MongoClient(connectionString);
let dbConnection: Db;

export default function db() {
    return dbConnection;
}

export async function connectToDatabase() {
    const mongoClient = await client.connect();
    dbConnection = mongoClient.db('umfrage-app');

    console.log('Successfully connected to database');
}