clean-services:
	sudo systemctl stop gunicorn || true
	sudo rm -f /etc/systemd/system/gunicorn.service

clone-repo:
	rm -rf /home/ubuntu/DevPilot
	git clone https://github.com/ProjectLabTeam2/DevPilot.git /home/ubuntu/DevPilot

create-env:
	cat > .env <<EOF
	FLASK_ENV=production
	SECRET_KEY=$(SECRET_KEY)
	JWT_SECRET_KEY=$(JWT_SECRET_KEY)
	DB_HOST=$(DB_HOST)
	DB_USER=$(DB_USER)
	DB_PASSWORD=$(DB_PASSWORD)
	DB_NAME=devpilotdb
	EOF

install-backend:
	rm -rf venv
	python3 -m venv venv
	. venv/bin/activate && \
	pip install --upgrade pip && \
	pip install -r requirements.txt && \
	deactivate

test-backend:
	. venv/bin/activate && pytest && deactivate

setup-gunicorn:
	sudo tee /etc/systemd/system/gunicorn.service > /dev/null <<EOF
	[Unit]
	Description=Gunicorn for DevPilot
	After=network.target

	[Service]
	User=ubuntu
	WorkingDirectory=$(BACKEND_DIR)
	EnvironmentFile=$(BACKEND_DIR)/.env
	ExecStart=$(BACKEND_DIR)/venv/bin/gunicorn -w 3 -b 127.0.0.1:5512 run:app
	Restart=always

	[Install]
	WantedBy=multi-user.target
	EOF

migrate-db:
	. venv/bin/activate && \
	FLASK_APP=run.py FLASK_ENV=production \
	SECRET_KEY=$(SECRET_KEY) \
	JWT_SECRET_KEY=$(JWT_SECRET_KEY) \
	DB_HOST=$(DB_HOST) DB_USER=$(DB_USER) DB_PASSWORD=$(DB_PASSWORD) DB_NAME=devpilotdb \
	flask db upgrade && \
	deactivate

test-frontend:
	npm ci
	npm run test -- --run

build-frontend:
	npm run build

fix-nginx-perms:
	sudo chmod 755 /home/ubuntu
	sudo chmod 755 /home/ubuntu/DevPilot
	sudo chmod 755 /home/ubuntu/DevPilot/frontend
	sudo chmod -R 755 /home/ubuntu/DevPilot/frontend/dist

restart-services:
	sudo systemctl daemon-reexec
	sudo systemctl daemon-reload
	sudo systemctl restart gunicorn
	sudo systemctl restart nginx