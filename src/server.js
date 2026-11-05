require('dotenv').config();

const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  if (!process.env.JWT_SECRET) {
    console.error('Falta JWT_SECRET en el archivo .env');
    process.exit(1);
  }
  try {
    await pool.query('SELECT 1');
    console.log('MySQL conectado');
  } catch (e) {
    console.error('No se pudo conectar a MySQL:', e.message);
    process.exit(1);
  }
  // 0.0.0.0 permite que el emulador (10.0.2.2) o un celular en tu red lleguen a la API
  app.listen(PORT, '0.0.0.0', () => console.log(`API lista en http://localhost:${PORT}`));
}

iniciar();
