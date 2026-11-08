USE inventario_papeleria;

-- 1. Los productos actuales (las muestras y lo creado en pruebas) no tienen dueño: se borran
DELETE FROM productos;

-- 2. Cada producto pertenece a un usuario
ALTER TABLE productos
  ADD COLUMN usuario_id INT NOT NULL AFTER id,
  ADD CONSTRAINT fk_productos_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON DELETE CASCADE;

-- 3. El código deja de ser único en toda la tabla y pasa a ser único por usuario
ALTER TABLE productos DROP INDEX codigo;
ALTER TABLE productos ADD CONSTRAINT uq_usuario_codigo UNIQUE (usuario_id, codigo);

-- 4. Ejemplos para las cuentas que ya existen (opcional: bórralo si no los quieres)
INSERT INTO productos (usuario_id, nombre, codigo, precio, existencias, categoria, fecha_ingreso)
SELECT id, 'Cuaderno profesional rayado', 'CUA-001', 45.50, 24, 'Cuadernos', CURDATE() FROM usuarios;
INSERT INTO productos (usuario_id, nombre, codigo, precio, existencias, categoria, fecha_ingreso)
SELECT id, 'Lápiz HB', 'LAP-001', 5.00, 100, 'Escritura', CURDATE() FROM usuarios;
INSERT INTO productos (usuario_id, nombre, codigo, precio, existencias, categoria, fecha_ingreso)
SELECT id, 'Pegamento en barra', 'PEG-001', 18.00, 2, 'Manualidades', CURDATE() FROM usuarios;