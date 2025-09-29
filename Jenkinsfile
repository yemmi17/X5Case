pipeline {
    agent any

    environment {
        DOCKERHUB_NAMESPACE = 'yemmi1'
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-token'
        SERVER_IP = '45.8.251.196'
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
                    env.IS_MAIN = (rawBranch == 'main' || rawBranch == 'dev') ? 'true' : 'false'
                    env.IMAGE_TAG = "${env.GIT_BRANCH_SAFE}-${env.GIT_SHA}"
                    env.LATEST_TAG = env.IS_MAIN == 'true' ? 'latest' : env.IMAGE_TAG
                }
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    withCredentials([string(credentialsId: env.DOCKERHUB_CREDENTIALS_ID, variable: 'DOCKERHUB_TOKEN')]) {
                        sh '''
                            echo "DockerHub namespace: ${DOCKERHUB_NAMESPACE}"
                            echo "Token length: ${#DOCKERHUB_TOKEN}"
                            echo "First 10 chars of token: ${DOCKERHUB_TOKEN:0:10}"
                            docker login -u ${DOCKERHUB_NAMESPACE} --password-stdin <<< "${DOCKERHUB_TOKEN}"
                            echo "Docker login exit code: $?"
                        ''' 
                    }
                }
            }
        }
 
        stage('Build Frontend') {
            steps {
                sh "docker build -t ${DOCKERHUB_NAMESPACE}/x5case-frontend:${IMAGE_TAG} -t ${DOCKERHUB_NAMESPACE}/x5case-frontend:${LATEST_TAG} ./frontend | cat"
            }
        }

        stage('Build ML Service') {
            steps {
                sh "docker build -t ${DOCKERHUB_NAMESPACE}/x5case-ner_service:${IMAGE_TAG} -t ${DOCKERHUB_NAMESPACE}/x5case-ner_service:${LATEST_TAG} ./ml | cat"
            }
        }

        stage('Build API Gateway') {
            steps {
                sh "docker build -t ${DOCKERHUB_NAMESPACE}/x5case-api_gateway:${IMAGE_TAG} -t ${DOCKERHUB_NAMESPACE}/x5case-api_gateway:${LATEST_TAG} ./backend/api_gateway | cat"
            }
        }

        stage('Build Search Service') {
            steps {
                sh "docker build -t ${DOCKERHUB_NAMESPACE}/x5case-search_service:${IMAGE_TAG} -t ${DOCKERHUB_NAMESPACE}/x5case-search_service:${LATEST_TAG} ./backend/search_service | cat"
            }
        }

        stage('Push Images') {
            steps {
                script {
                    def services = ['frontend','ner_service','api_gateway','search_service']
                    services.each { s ->
                        sh "docker push ${DOCKERHUB_NAMESPACE}/x5case-${s}:${IMAGE_TAG} | cat"
                        if (IS_MAIN == 'true') {
                            sh "docker push ${DOCKERHUB_NAMESPACE}/x5case-${s}:latest | cat"
                        }
                    }
                }
            }
        }

        stage('Sync Model (rsync)') {
            when { anyOf { branch 'main'; branch 'dev' } }
            steps {
                sh "ssh root@${SERVER_IP} 'mkdir -p /opt/x5case/model'"
                sh "rsync -avz --delete ./ml/model/ root@${SERVER_IP}:/opt/x5case/model/ | cat"
            }
        }

        stage('Deploy') {
            when { anyOf { branch 'main'; branch 'dev' } }
            steps {
                sh '''
                  ssh root@'"${SERVER_IP}"' '
                    set -e
                    if [ ! -d /opt/x5case ]; then mkdir -p /opt/x5case; fi
                    if [ ! -d /opt/x5case/.git ]; then
                      cd /opt/x5case
                      git clone --depth 1 '"${GIT_URL}"' . || true
                    fi
                    cd /opt/x5case
                    git fetch --all --prune
                    git reset --hard origin/'"${BRANCH_NAME}"'
                    docker compose pull | cat
                    docker compose up -d --remove-orphans | cat
                    docker compose ps | cat
                  '
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
        success {
            echo "Deployment successful! Frontend: http://${env.SERVER_IP}"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}