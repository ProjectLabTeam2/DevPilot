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
    stage('Setup Backend') {
      steps {
        dir('Backend') {
          sh '''#!/bin/bash
            rm -rf venv
            python3 -m venv venv
            source venv/bin/activate
            pip install -r requirements.txt
          '''
        }
      }
    }
    stage('Setup Frontend') {
      steps {
        dir('frontend') {
          sh 'npm ci'
        }
      }
    }
  }
}
