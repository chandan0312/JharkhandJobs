import { initMysqlDb, query as mysqlQuery, getPool as getMysqlPool } from './mysqlDb.js';
import { initPgDb, query as pgQuery, getPool as getPgPool, runDDL } from './pgDb.js';
import { initMockDb } from './mockDb.js';

const connectDB = async () => {
  try {
    console.log('🔌 Initializing Database Connection...');
    
    // 1. Attempt connecting to Hostinger / configured MySQL first
    const hasMysqlConfig = process.env.DB_HOST || process.env.DB_USER || process.env.DB_NAME;
    if (hasMysqlConfig) {
      const mysqlSuccess = await initMysqlDb();
      if (mysqlSuccess) {
        console.log('✨ Jharkhand Jobs Server is running on MySQL Database (Hostinger)!');
        global.useMockDb = false;
        global.useMysqlDb = true;
        global.usePgDb = false;
        return true;
      }
    }

    // 2. Attempt PostgreSQL if DATABASE_URL is set and USE_POSTGRES is true
    if (process.env.DATABASE_URL && process.env.USE_POSTGRES === 'true') {
      const pgSuccess = await initPgDb();
      if (pgSuccess) {
        console.log('✨ Jharkhand Jobs Server is running on PostgreSQL Database!');
        global.useMockDb = false;
        global.useMysqlDb = false;
        global.usePgDb = true;
        return true;
      }
    }

    throw new Error('Remote database connection could not be established.');
  } catch (error) {
    console.log('\n=============================================================');
    console.log('⚠️ Remote Database (MySQL) connection not established yet.');
    console.log('💡 Jharkhand Jobs Server is operating in Mock DB Mode.');
    console.log('✨ All website functionalities (Auth, Jobs, Search, Admin Dashboard) will work seamlessly!');
    console.log('=============================================================\n');
    
    await initMockDb();
    global.useMockDb = true;
    global.useMysqlDb = false;
    global.usePgDb = false;
    return false;
  }
};

export const query = async (text, params) => {
  if (global.useMysqlDb) {
    return mysqlQuery(text, params);
  }
  if (global.usePgDb) {
    return pgQuery(text, params);
  }
  throw new Error('No database pool is currently active.');
};

export const getPool = () => {
  if (global.useMysqlDb) return getMysqlPool();
  if (global.usePgDb) return getPgPool();
  return null;
};

export { runDDL, initPgDb, initMysqlDb };
export default connectDB;
