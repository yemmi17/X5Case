pipeline {
    agent any

    environment {
        DOCKERHUB_NAMESPACE = 'yemmi1'
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-token'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git --version | cat'
                sh 'ls -la'
            }
        }

        stage('Prepare Tags') {
            steps {
                script {
                    def rawBranch = env.BRANCH_NAME ?: sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    env.GIT_BRANCH_SAFE = rawBranch.toLowerCase().replaceAll('[^a-z0-9_.-]+', '-').replaceAll('^-+|-+$', '')
                    env.GIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    env.IS_MAIN = (rawBranch == 'main' || rawBranch == 'master') ? 'true' : 'false'
                }
            }
        }

        stage('Compose Build') {
            steps {
                script {
                    def composeFile = ''
                    if (env.BRANCH_NAME == 'dev' || env.BRANCH_NAME == 'main' || env.IS_MAIN == 'true') {
                        composeFile = 'docker-compose.yml'
                    }

                    echo "Using compose file: ${composeFile}"
                    sh "docker compose -f ${composeFile} build --no-cache | cat"
                }
            }
        }

        stage('Compose Up (detached)') {
            steps {
                script {
                    def composeFile = ''
                    if (env.BRANCH_NAME == 'main' || env.IS_MAIN == 'true') {
                        composeFile = 'docker-compose.yml'
                    }

                    echo "Bringing up services with: ${composeFile}"
                    sh "docker compose -f ${composeFile} up -d | cat"
                    sh "docker compose -f ${composeFile} ps | cat"
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
    }
}