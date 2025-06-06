pipeline {
  agent any
  environment {
    TF_WORKDIR = "infra/terraform"
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Tests Backend') {
      steps {
        dir('Backend') {
          sh '''#!/bin/bash
            rm -rf venv
            python3 -m venv venv
            source venv/bin/activate
            pip install --upgrade pip
            pip install -r requirements.txt
            pytest
          '''
        }
      }
    }
    stage('Tests Frontend') {
      steps {
        dir('Frontend') {
          sh 'npm install && npm test'
        }
      }
    }
    stage('Terraform Init & Plan') {
      steps {
        dir("${env.TF_WORKDIR}") {
          sh 'terraform init'
          sh 'terraform plan -out=devpilot.plan'
        }
      }
    }
    stage('Manual Approval') {
      steps {
        input message: "¿Aprobar Terraform plan?"
      }
    }
    stage('Terraform Apply') {
      steps {
        dir("${env.TF_WORKDIR}") {
          sh 'terraform apply "devpilot.plan"'
        }
      }
    }
    stage('Ansible Deploy') {
      steps {
        dir('infra/ansible') {
          sh 'ansible-playbook -i hosts.ini playbooks/webserver.yml'
        }
      }
    }
  }
}
