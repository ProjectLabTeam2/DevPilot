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

echo "Iniciando frontend React en segundo plano..."
npm ci
nohup npm run dev > react.log 2>&1 &

# Success
cd ..

echo "========================================="
echo " ✅ Desarrollo local preparado exitosamente"
echo " - Flask corriendo en http://127.0.0.1:5000"
echo " - React corriendo en http://localhost:5173"
echo "========================================="

