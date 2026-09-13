import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const runMigration = async () => {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const port = parseInt(process.env.DB_PORT) || 3306;

  console.log(`🔌 Connecting to Hostinger MySQL: ${user}@${host}:${port}/${database}...`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      user,
      password,
      database,
      port,
      multipleStatements: true,
      connectTimeout: 10000,
    });
    console.log('✅ Connected to Hostinger MySQL successfully!');
  } catch (err) {
    console.error('\n❌ Connection Failed:');
    console.error(`   ${err.message}`);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 TO FIX THIS IN HOSTINGER:');
      console.log('   1. Log in to Hostinger hPanel');
      console.log('   2. Navigate to: Databases -> Remote MySQL');
      console.log('   3. Under IP: Enter "%" (without quotes) or your IP');
      console.log(`   4. Select Database: ${database}`);
      console.log('   5. Click "Create"');
      console.log('   Then re-run this command: node ./scratch/migrate_to_mysql.js\n');
    }
    process.exit(1);
  }

  try {
    const dumpPath = path.resolve(__dirname, '../../jharkhand_db_mysql.sql');
    console.log(`📖 Reading SQL Dump: ${dumpPath}...`);
    const sqlContent = fs.readFileSync(dumpPath, 'utf8');

    console.log('🚀 Executing SQL migration (tables & initial data)...');
    await connection.query(sqlContent);
    console.log('✅ All schema and data statements executed successfully!');

    // Verification queries
    console.log('\n🔍 Verifying migrated data in Hostinger MySQL:');
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`   Tables in database: ${tables.length}`);
    for (const t of tables) {
      const tableName = Object.values(t)[0];
      const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
      console.log(`   - ${tableName}: ${countResult[0].count} records`);
    }

    console.log('\n🎉 Live MySQL Database Migration Complete!');
  } catch (err) {
    console.error('❌ Error executing SQL statements:', err.message);
  } finally {
    if (connection) await connection.end();
  }
};

runMigration();
