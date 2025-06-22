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

    stage('Clonar repositorio') {
      steps {
        sh 'make clone-repo'
      }
    }
    
    stage('Limpiar servicios previos') {
      steps {
        sh 'make clean-services'
      }
    }

    stage('Backend: Crear archivo .env') {
      steps {
        dir("${BACKEND_DIR}") {
          sh '''
            make create-env \
              SECRET_KEY=${SECRET_KEY} \
              JWT_SECRET_KEY=${JWT_SECRET_KEY} \
              DB_HOST=${RDS_ENDPOINT} \
              DB_USER=${DB_USER} \
              DB_PASSWORD=${DB_PASSWORD}
          '''
        }
      }
    }

    stage('Backend: Instalar dependencias') {
      steps {
        dir("${BACKEND_DIR}") {
          sh 'make install-backend'
        }
      }
    }

    stage('Backend: Tests') {
      agent { label 'test-agent' }
      steps {
        dir("${BACKEND_DIR}") {
          sh 'make test-backend'
        }
      }
    }

    stage('Backend: Crear servicio Gunicorn') {
      steps {
        sh 'make setup-gunicorn BACKEND_DIR=${BACKEND_DIR}'
      }
    }

    stage('Backend: Ejecutar migraciones') {
      steps {
        dir("${BACKEND_DIR}") {
          sh '''
            make migrate-db \
              SECRET_KEY=${SECRET_KEY} \
              JWT_SECRET_KEY=${JWT_SECRET_KEY} \
              DB_HOST=${RDS_ENDPOINT} \
              DB_USER=${DB_USER} \
              DB_PASSWORD=${DB_PASSWORD}
          '''
        }
      }
    }

    stage('Frontend: Tests') {
      agent { label 'test-agent' }
      steps {
        dir("${FRONTEND_DIR}") {
          sh 'make test-frontend'
        }
      }
    }

    stage('Frontend: Build') {
      steps {
        dir("${FRONTEND_DIR}") {
          sh 'make build-frontend'
        }
      }
    }

    stage('Frontend: Permisos para Nginx') {
      steps {
        sh 'make fix-nginx-perms'
      }
    }

    stage('Reiniciar servicios') {
      steps {
        sh 'make restart-services'
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