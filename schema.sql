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
  usuario_id    INT NOT NULL,
  nombre        VARCHAR(120) NOT NULL,
  codigo        VARCHAR(50)  NOT NULL,
  precio        DECIMAL(10,2) NOT NULL,
  existencias   INT NOT NULL DEFAULT 0,
  categoria     VARCHAR(80) NULL,
  fecha_ingreso DATE NOT NULL,
  CONSTRAINT fk_productos_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT uq_usuario_codigo UNIQUE (usuario_id, codigo),
  CONSTRAINT chk_precio CHECK (precio >= 0),
  CONSTRAINT chk_existencias CHECK (existencias >= 0)
);


