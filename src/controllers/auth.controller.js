const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function firmarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, correo: usuario.correo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '7d' }
  );
}

async function register(req, res) {
  const { nombre, correo, password } = req.body || {};

  const errores = [];
  if (!nombre || !String(nombre).trim()) errores.push('El nombre es obligatorio');
  if (!correo || !CORREO_REGEX.test(String(correo).trim())) errores.push('El correo no es válido');
  if (!password || String(password).length < 8) errores.push('La contraseña debe tener al menos 8 caracteres');
  if (errores.length) return res.status(400).json({ mensaje: errores.join('. '), errores });

  const nombreLimpio = String(nombre).trim();
  const correoNorm = String(correo).trim().toLowerCase();

  const [existe] = await pool.query('SELECT id FROM usuarios WHERE correo = ?', [correoNorm]);
  if (existe.length) return res.status(409).json({ mensaje: 'Ese correo ya está registrado' });

  const hash = await bcrypt.hash(String(password), 10); // nunca se guarda la contraseña en claro
  const [r] = await pool.query(
    'INSERT INTO usuarios (nombre, correo, password_hash) VALUES (?, ?, ?)',
    [nombreLimpio, correoNorm, hash]
  );

  const usuario = { id: r.insertId, nombre: nombreLimpio, correo: correoNorm };
  res.status(201).json({ token: firmarToken(usuario), usuario });
}

async function login(req, res) {
  const { correo, password } = req.body || {};

  if (!correo || !password) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
  }

  const correoNorm = String(correo).trim().toLowerCase();
  const [filas] = await pool.query(
    'SELECT id, nombre, correo, password_hash FROM usuarios WHERE correo = ?',
    [correoNorm]
  );

  // Mismo mensaje si falla el correo o la contraseña, para no revelar qué correos existen
  const fila = filas[0];
  const valido = fila && (await bcrypt.compare(String(password), fila.password_hash));
  if (!valido) return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });

  const usuario = { id: fila.id, nombre: fila.nombre, correo: fila.correo };
  res.json({ token: firmarToken(usuario), usuario });
}

module.exports = { register, login };
