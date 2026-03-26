#!/bin/bash
export PGPASSWORD="Artur47"
PG_USER="postgres"
PSQL="/Library/PostgreSQL/18/bin/psql"
CREATEDB="/Library/PostgreSQL/18/bin/createdb"

echo "Creando base de datos 'divertilandia'..."
$CREATEDB -U $PG_USER divertilandia 2>/dev/null || echo "  (ya existe, continuando...)"

echo "Cargando tablas y datos de ejemplo..."
$PSQL -U $PG_USER -d divertilandia -f db/setup.sql

echo ""
echo "Listo."
