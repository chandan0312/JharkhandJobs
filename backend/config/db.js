import mongoose from 'mongoose';
import { initMockDb } from './mockDb.js';
import { initPgDb } from './pgDb.js';

const connectDB = async () => {
  try {
    // Attempt connecting to PostgreSQL first
    const pgSuccess = await initPgDb();
    
    if (pgSuccess) {
      console.log('✨ Jharkhand Jobs Server is running on PostgreSQL Database!');
      global.useMockDb = false;
      global.usePgDb = true;
    } else {
      throw new Error('PostgreSQL connection attempt failed.');
    }
  } catch (error) {
    console.log('\n=============================================================');
    console.log('💡 Jharkhand Jobs Server is falling back to In-Memory DB Mode.');
    console.log('✨ All website functionalities (Auth, Search, Admin Dashboard) will work seamlessly!');
    console.log('=============================================================\n');
    
    await initMockDb();
    global.useMockDb = true;
    global.usePgDb = false;
  }
};

export default connectDB;

