clone-repo:
	rm -rf /home/ubuntu/DevPilot
	git clone https://github.com/ProjectLabTeam2/DevPilot.git /home/ubuntu/DevPilot

clean-services:
	sudo systemctl stop gunicorn || true
	sudo rm -f /etc/systemd/system/gunicorn.service

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