# Divertilandia — Sistema de Contratos

Sistema para generar contratos digitales de arrendamiento para el salón de fiestas infantiles **Divertilandia**.

---

## ¿Qué hace?

Genera automáticamente un contrato imprimible con todos los datos del cliente: local rentado, paquete de comida, personas, precios correctos según el día de la semana, extras y totales.

---

## Estructura del proyecto

| Archivo | Descripción |
|---|---|
| `appy.py` | Servidor principal en Python (Flask) |
| `index.html` | Contrato imprimible — se llena automáticamente |
| `.env` | Credenciales de la base de datos (no subir a internet) |
| `db/setup.sql` | Estructura de la tabla y 10 clientes de ejemplo |
| `db/crear_db.sh` | Script para crear la base de datos |
| `data.json` | Cliente de respaldo (si no hay servidor activo) |
| `data2-5.json` | Clientes de ejemplo para los tests |
| `tests/` | Tests automáticos con Playwright |
| `playwright.config.js` | Configuración de los tests |
| `server.js` | Servidor alternativo en Node.js (no se usa) |

---

## Paquetes disponibles

Cada local tiene 3 paquetes de comida y 2 capacidades:

| Paquete | Contenido |
|---|---|
| #1 Hot Dogs | Hot dogs |
| #2 Pizza | Pizza, ensalada y papas a la francesa |
| #3 Hamburguesa | Hamburguesa y papas a la francesa |

**Capacidades:** 50 o 100 personas
**Locales:** Local 1 y Local 2 (con o sin alberca)
**Precios:** varían según día (lunes-jueves vs viernes-domingo)

---

## Casos que cubre

- Local 1 o 2 + 50 o 100 personas + cualquier paquete de comida
- Precio correcto según día de la semana
- Local 2 con o sin alberca (descuento de $1,700 sin alberca)
- Solo renta del local sin paquete de comida
- Solo inflables o feria sin local
- Extras: inflables, feria, decoración con globos, otros

---

## Instalación

### Requisitos
- Python 3
- PostgreSQL 18
- Node.js (para los tests)

### 1. Instalar dependencias Python
```bash
pip3 install flask flask-cors psycopg2-binary python-dotenv
```

### 2. Configurar credenciales
Editar el archivo `.env`:
```
PG_USER=postgres
PG_PASSWORD=tu_password
PG_DB=divertilandia
PG_HOST=localhost
PG_PORT=5432
```

### 3. Crear la base de datos
```bash
cd ~/Desktop/Contratos-main
bash db/crear_db.sh
```

### 4. Arrancar el servidor
```bash
python3 appy.py
```

### 5. Abrir en el navegador
```
http://localhost:3000
```

---

## Tests

```bash
npm install
npm test
```

Corre 5 pruebas automáticas que verifican todos los escenarios del contrato.

---

## Flujo final (en desarrollo)

```
Página de selección  →  guarda en BD  →  redirige a /contrato?id=X  →  contrato listo para imprimir
```
