import mongoose from 'mongoose';
import { initMockDb } from './mockDb.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jharkhand_jobs', {
      serverSelectionTimeoutMS: 2000, // Timeout after 2 seconds instead of hanging
    });
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    global.useMockDb = false;
  } catch (error) {
    console.log('\n=============================================================');
    console.log('⚠️  COULD NOT CONNECT TO MONGODB LOCAL INSTANCE');
    console.log('💡 Jharkhand Jobs Server is falling back to In-Memory DB Mode.');
    console.log('✨ All website functionalities (Auth, Search, Admin Dashboard) will work seamlessly!');
    console.log('=============================================================\n');
    
    await initMockDb();
    global.useMockDb = true;
  }
};

export default connectDB;
