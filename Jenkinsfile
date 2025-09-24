pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'yemmi1/prodx5case:latest'
        DOCKER_CREDS = credentials('dockerhub-token')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'ls -la'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}")
                }
            }
        }
        
        stage('Push to DockerHub') {
            steps {
                script {
                    sh "echo ${DOCKER_CREDS_PSW} | docker login -u ${DOCKER_CREDS_USR} --password-stdin"
                    sh "docker push ${DOCKER_IMAGE}"
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
        }
    }
}