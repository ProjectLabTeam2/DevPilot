pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
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
