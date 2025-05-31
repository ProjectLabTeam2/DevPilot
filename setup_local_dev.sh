#!/bin/bash

echo "========================================="
echo " REQUISITOS:"
echo " - Debes tener la base de datos 'devpilot-db' creada en tu pgAdmin."
echo " - El script utiliza la dirección local (127.0.0.1) en el puerto 5432."
echo "========================================="

# Credentials
read -p "Ingrese el usuario de PostgreSQL: " DB_USER
read -s -p "Ingrese la contraseña de PostgreSQL: " DB_PASSWORD
echo ""

# Consts
DB_HOST="127.0.0.1"
DB_PORT="5432"
DB_NAME="devpilot-db"
CONFIG_PATH="Backend/app/config.py"

# Replace config.py
echo "Modificando archivo config.py..."

ESCAPED_PASSWORD=$(printf '%s\n' "$DB_PASSWORD" | sed 's/[\/&]/\\&/g')

NEW_URI="    SQLALCHEMY_DATABASE_URI = (\n        f\"postgresql://$DB_USER:$ESCAPED_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME\"\n    )"

sed -i "/SQLALCHEMY_DATABASE_URI = (/{
N
N
s|.*SQLALCHEMY_DATABASE_URI = (.*\n.*\n.*)|$NEW_URI|
}" "$CONFIG_PATH"

# Prepare venv
cd Backend || exit 1

echo "Preparando entorno virtual en Backend..."
rm -rf venv
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

# Deploy migrations
echo ""
echo "¿Deseas crear las tablas en la base de datos?"
echo "1. Sí"
echo "2. No"
read -p "Seleccione una opción: " OPCION_TABLAS

if [ "$OPCION_TABLAS" == "1" ]; then
    echo "Ejecutando migraciones..."
    flask db upgrade
fi

# Execute Flask in background
echo "Iniciando servidor Flask en segundo plano..."
nohup flask run > flask.log 2>&1 &

deactivate

# Modify api.js
cd ..

API_JS_PATH="frontend/src/api/api.js"
echo "Modificando archivo api.js..."
sed -i "s|baseURL: .*|baseURL: 'http://127.0.0.1:5000/api',|" "$API_JS_PATH"

# Execute React in background
cd frontend || exit 1

echo "Instalando dependencias con npm ci..."
npm ci

# Open VSC
echo ""
echo "¿Deseas abrir Visual Studio Code?"
echo "1. Sí"
echo "2. No"
read -p "Seleccione una opción (1 o 2): " OPCION_CODE

if [ "$OPCION_CODE" == "1" ]; then
    cd ..
    code .
    cd frontend
fi

echo "========================================="
echo " ✅ Desarrollo local preparado exitosamente"
echo "========================================="

npm run dev
