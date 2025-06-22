create-env:
	echo "FLASK_ENV=production" > .env && \
	echo "SECRET_KEY=$(SECRET_KEY)" >> .env && \
	echo "JWT_SECRET_KEY=$(JWT_SECRET_KEY)" >> .env && \
	echo "DB_HOST=$(DB_HOST)" >> .env && \
	echo "DB_USER=$(DB_USER)" >> .env && \
	echo "DB_PASSWORD=$(DB_PASSWORD)" >> .env && \
	echo "DB_NAME=devpilotdb" >> .env

install-backend:
	rm -rf venv
	python3 -m venv venv
	. venv/bin/activate && \
	pip install --upgrade pip && \
	pip install -r requirements.txt && \
	deactivate

test-backend:
	. venv/bin/activate && pytest && deactivate

migrate-db:
	. venv/bin/activate && \
	FLASK_APP=run.py FLASK_ENV=production \
	SECRET_KEY=$(SECRET_KEY) \
	JWT_SECRET_KEY=$(JWT_SECRET_KEY) \
	DB_HOST=$(DB_HOST) DB_USER=$(DB_USER) DB_PASSWORD=$(DB_PASSWORD) DB_NAME=devpilotdb \
	flask db upgrade && \
	deactivate