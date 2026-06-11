const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT) || 1433,
  database: process.env.DB_DATABASE || 'AttendanceDB',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true,
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
};

let pool;

const connectDB = async () => {
  try {
    pool = await sql.connect(dbConfig);
    console.log('✅ MSSQL connected successfully');
    pool.on('error', (err) => console.error('❌ MSSQL pool error:', err));
    return pool;
  } catch (err) {
    console.error('❌ MSSQL connection failed:', err.message);
    process.exit(1);
  }
};

const getPool = () => {
  if (!pool) throw new Error('DB not initialised — call connectDB() first');
  return pool;
};

module.exports = { connectDB, getPool, sql };
