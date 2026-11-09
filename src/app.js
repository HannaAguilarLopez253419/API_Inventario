const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', authRoutes);               
app.use('/productos', productosRoutes); 

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' });
  }
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

module.exports = app;
