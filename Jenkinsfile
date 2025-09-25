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

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_USR', passwordVariable: 'DOCKER_PSW')]) {
                    sh 'echo "$DOCKER_PSW" | docker login -u "$DOCKER_USR" --password-stdin'
                }
            }
        }

        stage('Build & Push Images') {
            steps {
                script {
                    def services = [
                        [name: 'api-gateway', image: "${env.DOCKERHUB_NAMESPACE}/x5case-api-gateway", context: 'backend/api_gateway', dockerfile: 'Dockerfile'],
                        [name: 'search-service', image: "${env.DOCKERHUB_NAMESPACE}/x5case-search-service", context: 'backend/search_service', dockerfile: 'Dockerfile'],
                        [name: 'ner-service', image: "${env.DOCKERHUB_NAMESPACE}/x5case-ner-service", context: 'backend/ner_service', dockerfile: 'Dockerfile'],
                        [name: 'ml', image: "${env.DOCKERHUB_NAMESPACE}/x5case-ml", context: 'ml', dockerfile: 'Dockerfile']
                    ]

                    def stepsForParallel = services.collectEntries { svc ->
                        [(svc.name): {
                            stage("Build & Push: ${svc.name}") {
                                sh """
                                  set -e
                                  echo "Building ${svc.image}:${GIT_SHA} from ${svc.context}/${svc.dockerfile}"
                                  docker build -t ${svc.image}:${GIT_SHA} -f ${svc.context}/${svc.dockerfile} ${svc.context}

                                  # Tag with branch
                                  docker tag ${svc.image}:${GIT_SHA} ${svc.image}:${GIT_BRANCH_SAFE}

                                  # Optionally tag latest on main
                                  if [ "${IS_MAIN}" = "true" ]; then
                                    docker tag ${svc.image}:${GIT_SHA} ${svc.image}:latest
                                  fi

                                  # Push tags
                                  docker push ${svc.image}:${GIT_SHA}
                                  docker push ${svc.image}:${GIT_BRANCH_SAFE}
                                  if [ "${IS_MAIN}" = "true" ]; then
                                    docker push ${svc.image}:latest
                                  fi
                                """
                            }
                        }]
                    }

                    parallel stepsForParallel
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