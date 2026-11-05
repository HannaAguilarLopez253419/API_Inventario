# API de inventario (papelería)

API REST con Express + MySQL. Registro, login con token (JWT) y CRUD de productos.

## Puesta en marcha
1. En MySQL Workbench abre `schema.sql` y ejecútalo completo (crea la base, las tablas y 3 productos de ejemplo).
2. Copia `.env.example` a `.env` y pon tu contraseña de MySQL y un `JWT_SECRET` propio.
3. En la carpeta del proyecto:
   ```
   npm install
   npm run dev
   ```
   Debes ver `MySQL conectado` y `API lista en http://localhost:3000`.

## Contrato
Todas las respuestas de error tienen la forma `{ "mensaje": "..." }`.

| Método | Ruta | Token | Cuerpo | Respuesta |
|---|---|---|---|---|
| POST | /register | no | `{nombre, correo, password}` | 201 `{token, usuario:{id,nombre,correo}}` |
| POST | /login | no | `{correo, password}` | 200 `{token, usuario}` |
| GET | /productos | sí | (opcional `?buscar=texto`) | 200 lista de productos |
| GET | /productos/:id | sí | | 200 producto / 404 |
| POST | /productos | sí | producto sin id | 201 producto creado |
| PUT | /productos/:id | sí | producto sin id | 200 producto actualizado |
| DELETE | /productos/:id | sí | | 204 sin cuerpo / 404 |

Token en el encabezado: `Authorization: Bearer <token>`.

Producto:
```json
{
  "id": 1,
  "nombre": "Cuaderno profesional rayado",
  "codigo": "CUA-001",
  "precio": 45.5,
  "existencias": 24,
  "categoria": "Cuadernos",
  "fechaIngreso": "2026-10-15"
}
```
Códigos de error: 400 datos inválidos, 401 sin token o credenciales malas, 404 no existe, 409 correo o código repetido.

## Pruebas rápidas (Postman o curl)
```
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" \
  -d '{"nombre":"Hanni","correo":"hanni@correo.com","password":"12345678"}'

curl http://localhost:3000/productos -H "Authorization: Bearer TU_TOKEN"
```
