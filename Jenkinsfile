pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code from repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies from package.json...'
                sh 'npm install selenium-webdriver assert'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo 'Executing test suite...'
                sh 'node DataBase/test_app.js'
            }
        }
    }

    post {
        success {
            emailext (
                subject: "SUCCESS: Job '${env.JOB_NAME}' [Build #${env.BUILD_NUMBER}]",
                body: "The test stage completed successfully. All tests passed.",
                to: 'musharafulislam333@email.com',
                recipientProviders: [culprits()]
            )
        }
        failure {
            emailext (
                subject: "FAILURE: Job '${env.JOB_NAME}' [Build #${env.BUILD_NUMBER}]",
                body: "There was an error during the pipeline test stage. Please check the console output.",
                to: 'musharafulislam333@email.com',
                recipientProviders: [culprits()]
            )
        }
    }
}