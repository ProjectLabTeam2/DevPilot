clone-repo:
	rm -rf /home/ubuntu/DevPilot
	git clone https://github.com/ProjectLabTeam2/DevPilot.git /home/ubuntu/DevPilot

clean-services:
	sudo systemctl stop gunicorn || true
	sudo rm -f /etc/systemd/system/gunicorn.service

setup-gunicorn:
	printf "[Unit]\n\
Description=Gunicorn for DevPilot\n\
After=network.target\n\n\
[Service]\n\
User=ubuntu\n\
WorkingDirectory=$(BACKEND_DIR)\n\
EnvironmentFile=$(BACKEND_DIR)/.env\n\
ExecStart=$(BACKEND_DIR)/venv/bin/gunicorn -w 3 -b 127.0.0.1:5512 run:app\n\
Restart=always\n\n\
[Install]\n\
WantedBy=multi-user.target\n" | sudo tee /etc/systemd/system/gunicorn.service > /dev/null

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