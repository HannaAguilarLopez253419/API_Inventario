const mysql = require('mysql2/promise');

// Un solo pool compartido por toda la API
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'inventario_papeleria',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true, // las fechas DATE llegan como "2026-11-04" y no como objetos Date
});

module.exports = pool;
