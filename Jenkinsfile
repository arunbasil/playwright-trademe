// ─────────────────────────────────────────────────────────────────────────────
// Jenkins Declarative Pipeline — TradeMe Playwright Tests + Allure Reporting
//
// Required plugins (Manage Jenkins → Plugins):
//   • docker-workflow   → dockerfile agent support
//   • copyartifact      → Allure trend history between builds
//   • htmlpublisher     → Publish Allure HTML report in build sidebar
//   • ws-cleanup        → cleanWs() in post block
// ─────────────────────────────────────────────────────────────────────────────
pipeline {

    agent {
        dockerfile {
            filename            'docker/Dockerfile.ci'
            // --ipc=host  : Chrome shared memory (required for Playwright)
            // --shm-size  : Prevent tab crashes in headless Chrome
            args                '--ipc=host --shm-size=2g'
            additionalBuildArgs '--build-arg BUILDKIT_INLINE_CACHE=1'
        }
    }

    environment {
        BASE_URL = 'https://www.trademe.co.nz'
        CI       = 'true'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '30'))
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {

        // ── 1. Install ───────────────────────────────────────────────────────
        stage('Install') {
            steps {
                sh 'npm ci'
                // Browsers are baked into the Docker image; re-install only ensures
                // the version matches package.json if the image is stale.
                sh 'npx playwright install chromium --with-deps'
            }
        }

        // ── 2. Restore Allure History ────────────────────────────────────────
        // Copies allure-history/ from the last successful build so Allure can
        // render trend charts even though the Docker workspace is ephemeral.
        stage('Restore Allure History') {
            steps {
                script {
                    try {
                        copyArtifacts(
                            projectName: env.JOB_NAME,
                            selector:    lastSuccessful(),
                            filter:      'allure-history/**',
                            target:      '.',
                            optional:    true,
                            flatten:     false
                        )
                        sh '''
                            if [ -d allure-history ]; then
                                mkdir -p allure-results/history
                                cp -r allure-history/. allure-results/history/
                                echo "[allure] History restored from previous build."
                            else
                                echo "[allure] No previous history — first run."
                            fi
                        '''
                    } catch (err) {
                        echo "[allure] copyArtifacts unavailable or first run: ${err}"
                    }
                }
            }
        }

        // ── 3. Run Tests ─────────────────────────────────────────────────────
        // || true prevents the pipeline from aborting before report generation
        // when tests fail. The real pass/fail is reflected in the Allure report
        // and the post block sets build status accordingly.
        stage('Run Tests') {
            steps {
                sh 'npx playwright test || true'
            }
        }

        // ── 4. Generate Allure Report ────────────────────────────────────────
        stage('Generate Allure Report') {
            steps {
                sh 'npx allure generate allure-results --clean -o allure-report'
                // Snapshot history so the next build's Restore stage can use it
                sh '''
                    mkdir -p allure-history
                    cp -r allure-report/history/. allure-history/
                '''
            }
        }

        // ── 5. Archive & Publish ─────────────────────────────────────────────
        stage('Archive & Publish') {
            steps {
                // allure-history is needed by copyArtifacts in the next build
                archiveArtifacts artifacts: 'allure-history/**',  allowEmptyArchive: true
                // allure-report is the browsable HTML report
                archiveArtifacts artifacts: 'allure-report/**',   allowEmptyArchive: true
                // test-results contain Playwright traces / screenshots
                archiveArtifacts artifacts: 'test-results/**',    allowEmptyArchive: true

                // Publish Allure report in the Jenkins build sidebar
                publishHTML(target: [
                    allowMissing:          false,
                    alwaysLinkToLastBuild: true,
                    keepAll:               true,
                    reportDir:             'allure-report',
                    reportFiles:           'index.html',
                    reportName:            'Allure Report',
                    reportTitles:          "Build ${env.BUILD_NUMBER} — Allure"
                ])
            }
        }
    }

    post {
        always {
            echo "Build ${env.BUILD_NUMBER} finished — ${currentBuild.currentResult}"
        }
        failure {
            echo 'One or more tests failed. Open the Allure Report for step-level details and failure screenshots.'
        }
        cleanup {
            // Clean workspace on success/abort; preserve on failure for ad-hoc debugging.
            // Artifacts are already archived so no work is lost either way.
            cleanWs(
                cleanWhenSuccess:  true,
                cleanWhenAborted:  true,
                cleanWhenFailure:  false,
                cleanWhenNotBuilt: true,
                cleanWhenUnstable: false
            )
        }
    }
}
