import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection: Error'));
db.once('open', console.log.bind(console, 'MongoDB connection: Successful'));

export default db;
