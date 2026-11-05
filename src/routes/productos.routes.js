const router = require('express').Router();
const autenticar = require('../middlewares/auth');
const c = require('../controllers/productos.controller');

router.use(autenticar); // todas las rutas de productos exigen token

router.get('/', c.listar);
router.get('/:id', c.obtener);
router.post('/', c.crear);
router.put('/:id', c.actualizar);
router.delete('/:id', c.eliminar);

module.exports = router;
