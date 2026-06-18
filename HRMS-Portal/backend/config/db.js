const sql = require("mssql");
require("dotenv").config();

const dbConfig = {
  server: String(process.env.DB_SERVER || "localhost").trim(),
  user: String(process.env.DB_USER || "sa").trim(),
  password: String(process.env.DB_PASSWORD || "").trim(),
  database: String(process.env.DB_DATABASE || "master").trim(),
  port: Number(process.env.DB_PORT || 1433),

  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    instanceName: "SQLEXPRESS",
  },

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool;

const connectDB = async () => {
  try {
    console.log("========= DB DEBUG =========");
    console.log({
      server: dbConfig.server,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
      passwordExists: !!dbConfig.password,
      passwordLength: dbConfig.password.length,
      instanceName: dbConfig.options.instanceName,
    });
    console.log("============================");

    pool = await sql.connect(dbConfig);

    console.log("✅ MSSQL connected successfully");

    pool.on("error", (err) => {
      console.error("❌ MSSQL pool error:", err);
    });

    return pool;
  } catch (err) {
    console.error("❌ FULL MSSQL CONNECTION ERROR:");
    console.error(err);

    console.error("MESSAGE:", err.message);
    console.error("CODE:", err.code);
    console.error("NAME:", err.name);
    console.error("STATE:", err.state);
    console.error("CLASS:", err.class);

    process.exit(1);
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error("DB not initialised. Call connectDB() first.");
  }
  return pool;
};

module.exports = {
  connectDB,
  getPool,
  sql,
};