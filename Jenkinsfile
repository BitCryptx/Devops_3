pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install selenium-webdriver assert'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo 'Running tests...'
                sh 'node DataBase/test_app.js'
            }
        }
    }

    post {
        success {
            emailext (
                subject: "SUCCESS: Job '${env.JOB_NAME}' [Build #${env.BUILD_NUMBER}]",
                body: "The test stage completed successfully.",
                to: 'musharafulislam333@email.com',
                recipientProviders: [culprits()]
            )
        }
        failure {
            emailext (
                subject: "FAILURE: Job '${env.JOB_NAME}' [Build #${env.BUILD_NUMBER}]",
                body: "Pipeline failed during execution. Check the console output for details.",
                to: 'musharafulislam333@email.com',
                recipientProviders: [culprits()]
            )
        }
    }
}