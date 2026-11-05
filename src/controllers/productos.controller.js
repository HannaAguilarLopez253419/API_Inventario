const pool = require('../config/db');

const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Acepta solo fechas reales (rechaza, por ejemplo, 2026-02-31)
function fechaValida(texto) {
  if (!FECHA_REGEX.test(texto)) return false;
  const d = new Date(`${texto}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === texto;
}

// Fila de MySQL (snake_case) -> JSON de la API (camelCase)
function aProducto(f) {
  return {
    id: f.id,
    nombre: f.nombre,
    codigo: f.codigo,
    precio: Number(f.precio),
    existencias: f.existencias,
    categoria: f.categoria,
    fechaIngreso: f.fecha_ingreso,
  };
}

function validar(body) {
  const b = body || {};
  const errores = [];

  const nombre = String(b.nombre ?? '').trim();
  const codigo = String(b.codigo ?? '').trim();
  const categoria = b.categoria == null ? '' : String(b.categoria).trim();
  const fechaIngreso = String(b.fechaIngreso ?? '').trim();

  const vacio = (v) => v === undefined || v === null || v === '';
  const precio = Number(b.precio);
  const existencias = Number(b.existencias);

  if (!nombre) errores.push('El nombre es obligatorio');
  if (!codigo) errores.push('El código es obligatorio');
  if (vacio(b.precio) || Number.isNaN(precio) || precio < 0) {
    errores.push('El precio debe ser un número mayor o igual a 0');
  }
  if (vacio(b.existencias) || !Number.isInteger(existencias) || existencias < 0) {
    errores.push('Las existencias deben ser un entero mayor o igual a 0');
  }
  if (!fechaValida(fechaIngreso)) {
    errores.push('La fecha de ingreso debe tener el formato AAAA-MM-DD');
  }

  return {
    errores,
    datos: { nombre, codigo, precio, existencias, categoria: categoria || null, fechaIngreso },
  };
}

function leerId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ mensaje: 'El id no es válido' });
    return null;
  }
  return id;
}

async function listar(req, res) {
  const buscar = String(req.query.buscar ?? '').trim();
  const [filas] = buscar
    ? await pool.query('SELECT * FROM productos WHERE nombre LIKE ? ORDER BY id DESC', [`%${buscar}%`])
    : await pool.query('SELECT * FROM productos ORDER BY id DESC');
  res.json(filas.map(aProducto));
}

async function obtener(req, res) {
  const id = leerId(req, res);
  if (id === null) return;
  const [filas] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
  if (!filas.length) return res.status(404).json({ mensaje: 'Producto no encontrado' });
  res.json(aProducto(filas[0]));
}

async function crear(req, res) {
  const { errores, datos } = validar(req.body);
  if (errores.length) return res.status(400).json({ mensaje: errores.join('. '), errores });

  try {
    const [r] = await pool.query(
      `INSERT INTO productos (nombre, codigo, precio, existencias, categoria, fecha_ingreso)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [datos.nombre, datos.codigo, datos.precio, datos.existencias, datos.categoria, datos.fechaIngreso]
    );
    const [filas] = await pool.query('SELECT * FROM productos WHERE id = ?', [r.insertId]);
    res.status(201).json(aProducto(filas[0]));
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensaje: 'Ya existe un producto con ese código' });
    }
    throw e;
  }
}

async function actualizar(req, res) {
  const id = leerId(req, res);
  if (id === null) return;

  const { errores, datos } = validar(req.body);
  if (errores.length) return res.status(400).json({ mensaje: errores.join('. '), errores });

  try {
    const [r] = await pool.query(
      `UPDATE productos
          SET nombre = ?, codigo = ?, precio = ?, existencias = ?, categoria = ?, fecha_ingreso = ?
        WHERE id = ?`,
      [datos.nombre, datos.codigo, datos.precio, datos.existencias, datos.categoria, datos.fechaIngreso, id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    const [filas] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    res.json(aProducto(filas[0]));
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensaje: 'Ya existe un producto con ese código' });
    }
    throw e;
  }
}

async function eliminar(req, res) {
  const id = leerId(req, res);
  if (id === null) return;
  const [r] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);
  if (r.affectedRows === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
  res.status(204).end();
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
