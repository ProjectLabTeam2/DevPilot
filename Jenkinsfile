pipeline {
  agent { label 'build-agent' }

  environment {
    PROJECT_DIR = "/home/ubuntu/DevPilot"
    BACKEND_DIR = "${PROJECT_DIR}/Backend"
    FRONTEND_DIR = "${PROJECT_DIR}/frontend"
    DISCORD_WEBHOOK = credentials('discord-msg')
    SECRET_KEY = credentials('devpilot-secret-key')
    JWT_SECRET_KEY = credentials('devpilot-jwt-key')
    DB_USER = credentials('devpilot-db-user')
    DB_PASSWORD = credentials('devpilot-db-pass')
    RDS_ENDPOINT = credentials('devpilot-rds-endpoint')
  }

  stages {

    stage('Limpiar servicios previos') {
      steps {
        sh '''
          sudo systemctl stop gunicorn || true
          sudo rm -f /etc/systemd/system/gunicorn.service
        '''
      }
    }
    
    stage('Clonar repositorio') {
      steps {
        sh '''
          rm -rf ${PROJECT_DIR}
          git clone https://github.com/ProjectLabTeam2/DevPilot.git ${PROJECT_DIR}
        '''
      }
    }

    stage('Backend: Crear archivo .env') {
      steps {
        dir("${BACKEND_DIR}") {
          sh '''
            cat <<EOF > .env
    FLASK_ENV=production
    SECRET_KEY=${SECRET_KEY}
    JWT_SECRET_KEY=${JWT_SECRET_KEY}
    DB_HOST=${RDS_ENDPOINT}
    DB_USER=${DB_USER}
    DB_PASSWORD=${DB_PASSWORD}
    DB_NAME=devpilotdb
    EOF
          '''
        }
      }
    }

    stage('Backend: Instalar dependencias') {
      steps {
        dir("${BACKEND_DIR}") {
          sh 'rm -rf venv'
          sh 'python3 -m venv venv'
          sh '''
            . venv/bin/activate
            pip install --upgrade pip
            pip install -r requirements.txt
            deactivate
          '''
        }
      }
    }

    stage('Backend: Crear servicio Gunicorn') {
      steps {
        sh '''
          sudo tee /etc/systemd/system/gunicorn.service > /dev/null <<EOF
          [Unit]
          Description=Gunicorn for DevPilot
          After=network.target

          [Service]
          User=ubuntu
          WorkingDirectory=${BACKEND_DIR}
          EnvironmentFile=${BACKEND_DIR}/.env
          ExecStart=${BACKEND_DIR}/venv/bin/gunicorn -w 3 -b 127.0.0.1:5512 run:app
          Restart=always

          [Install]
          WantedBy=multi-user.target
          EOF
        '''
      }
    }

    stage('Backend: Ejecutar migraciones') {
      steps {
        dir("${BACKEND_DIR}") {
          sh '''
            . venv/bin/activate
            FLASK_APP=run.py FLASK_ENV=production \
            SECRET_KEY=$SECRET_KEY \
            JWT_SECRET_KEY=$JWT_SECRET_KEY \
            DB_HOST=$RDS_ENDPOINT DB_USER=$DB_USER DB_PASSWORD=$DB_PASSWORD DB_NAME=devpilotdb \
            flask db upgrade
            deactivate
          '''
        }
      }
    }

    stage('Frontend: Build') {
      steps {
        dir("${FRONTEND_DIR}") {
          sh '''
            npm ci
            npm run build
          '''
        }
      }
    }

    stage('Frontend: Permisos para Nginx') {
      steps {
        sh '''
          sudo chmod 755 /home/ubuntu
          sudo chmod 755 /home/ubuntu/DevPilot
          sudo chmod 755 /home/ubuntu/DevPilot/frontend
          sudo chmod -R 755 /home/ubuntu/DevPilot/frontend/dist
        '''
      }
    }

    stage('Reiniciar servicios') {
      steps {
        sh '''
          sudo systemctl daemon-reexec
          sudo systemctl daemon-reload
          sudo systemctl restart gunicorn
          sudo systemctl restart nginx
        '''
      }
    }
  }

  post {
    success {
      sh '''
        curl -H "Content-Type: application/json" \
        -X POST -d "{
          \\"content\\": \\"✅ *Build Exitoso* - Job: ${JOB_NAME} (#${BUILD_NUMBER})\\\\nURL: ${BUILD_URL}\\"
        }" "$DISCORD_WEBHOOK"
      '''
    }
    failure {
      sh '''
        curl -H "Content-Type: application/json" \
        -X POST -d "{
          \\"content\\": \\"❌ *Build Fallido* - Job: ${JOB_NAME} (#${BUILD_NUMBER})\\\\nURL: ${BUILD_URL}\\"
        }" "$DISCORD_WEBHOOK"
      '''
    }
  }
}