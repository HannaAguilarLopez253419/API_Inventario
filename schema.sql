-- Ejecuta este archivo completo en MySQL Workbench (rayo ⚡)
CREATE DATABASE IF NOT EXISTS inventario_papeleria
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inventario_papeleria;

CREATE TABLE IF NOT EXISTS usuarios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  correo        VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  creado_en     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(120) NOT NULL,
  codigo        VARCHAR(50)  NOT NULL UNIQUE,
  precio        DECIMAL(10,2) NOT NULL,
  existencias   INT NOT NULL DEFAULT 0,
  categoria     VARCHAR(80) NULL,
  fecha_ingreso DATE NOT NULL,
  CONSTRAINT chk_precio CHECK (precio >= 0),
  CONSTRAINT chk_existencias CHECK (existencias >= 0)
);

-- Datos de ejemplo (opcional, para probar la lista)
INSERT INTO productos (nombre, codigo, precio, existencias, categoria, fecha_ingreso) VALUES
  ('Cuaderno profesional rayado', 'CUA-001', 45.50, 24, 'Cuadernos', '2026-10-15'),
  ('Lápiz HB', 'LAP-001', 5.00, 100, 'Escritura', '2026-10-20'),
  ('Pegamento en barra', 'PEG-001', 18.00, 2, 'Manualidades', '2026-11-01');
