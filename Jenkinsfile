pipeline {
    agent any

    stages {
        stage('Build System') {
            steps {
                echo 'Building the Docker images for RAM Forensics...'
                // 'bat' is used because you are running Windows
                bat 'docker-compose build'
            }
        }
        
        stage('Deploy to Docker') {
            steps {
                echo 'Taking down old containers...'
                bat 'docker-compose down'
                
                echo 'Spinning up new containers in the background...'
                // The -d flag runs it in the background so Jenkins can finish the job
                bat 'docker-compose up -d'
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully! RAM Forensics is live.'
        }
        failure {
            echo '❌ Pipeline failed. Check the logs above.'
        }
    }
}