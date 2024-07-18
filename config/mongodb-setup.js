import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.set('strictQuery', false);
const devDB = '???';
const mongoDB = process.env.MONGODB_URI || devDB;

async function dbSetup() {
  try {
    await mongoose.connect(mongoDB);
  } catch (err) {
    console.log(err);
  }
}

export default dbSetup;
