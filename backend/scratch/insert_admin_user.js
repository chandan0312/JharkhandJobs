import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    console.log('✍️ Inserting jharkhandjobs03@gmail.com as admin user in Supabase...');
    
    const admins = ['jharkhandjobs03@gmail.com', 'admin@jharkhandjobs.com'];
    for (const email of admins) {
      const checkRes = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
      
      if (checkRes.rows.length > 0) {
        await pool.query("UPDATE users SET role = 'admin' WHERE LOWER(email) = LOWER($1)", [email]);
        console.log(`✅ User ${email} already exists. Successfully promoted role to admin.`);
      } else {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('Admin@123', salt);
        
        await pool.query(`
          INSERT INTO users (id, name, email, password, phone, role, created_at, updated_at) 
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        `, [
          `admin-${email.split('@')[0]}`,
          'Jharkhand Jobs Admin',
          email,
          passwordHash,
          '9876543210',
          'admin'
        ]);
        console.log(`✅ Successfully inserted ${email} as an admin user.`);
      }
    }
    
    // Verify the user list in the database
    const res = await pool.query('SELECT id, name, email, role, google_id FROM users');
    console.log('\n--- Active Users in Database ---');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('❌ Error during user insertion:', err);
  } finally {
    await pool.end();
  }
};

run();
