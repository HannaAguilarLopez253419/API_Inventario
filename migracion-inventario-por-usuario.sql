USE inventario_papeleria;

DELETE FROM productos;

ALTER TABLE productos
  ADD COLUMN usuario_id INT NOT NULL AFTER id,
  ADD CONSTRAINT fk_productos_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON DELETE CASCADE;

ALTER TABLE productos DROP INDEX codigo;
ALTER TABLE productos ADD CONSTRAINT uq_usuario_codigo UNIQUE (usuario_id, codigo);

INSERT INTO productos (usuario_id, nombre, codigo, precio, existencias, categoria, fecha_ingreso)
SELECT id, 'Cuaderno profesional rayado', 'CUA-001', 45.50, 24, 'Cuadernos', CURDATE() FROM usuarios;
INSERT INTO productos (usuario_id, nombre, codigo, precio, existencias, categoria, fecha_ingreso)
SELECT id, 'Lápiz HB', 'LAP-001', 5.00, 100, 'Escritura', CURDATE() FROM usuarios;
INSERT INTO productos (usuario_id, nombre, codigo, precio, existencias, categoria, fecha_ingreso)
SELECT id, 'Pegamento en barra', 'PEG-001', 18.00, 2, 'Manualidades', CURDATE() FROM usuarios;