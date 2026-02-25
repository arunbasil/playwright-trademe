// ─────────────────────────────────────────────────────────────────────────────
// Jenkins Declarative Pipeline — TradeMe Playwright Tests + Allure Reporting
//
// Required plugins (Manage Jenkins → Plugins):
//   • docker-workflow        → dockerfile agent support
//   • copyartifact           → Allure trend history between builds
//   • htmlpublisher          → Publish Allure HTML report in build sidebar
//   • ws-cleanup             → cleanWs() in post block
//   • ansicolor              → ANSI colour in npm/playwright console output
//   • configuration-as-code  → JCasC (docker/jenkins.yaml) for cloud migration
//
// ── AWS Migration Note ────────────────────────────────────────────────────────
// To move to EKS, replace the agent block below with:
//
//   agent {
//     kubernetes {
//       yaml '''
//         apiVersion: v1
//         kind: Pod
//         spec:
//           containers:
//           - name: playwright
//             image: <ECR_URI>/playwright-trademe-ci:1.58.2
//             command: ["sleep", "infinity"]
//             resources:
//               requests: { memory: "2Gi", cpu: "1" }
//               limits:   { memory: "4Gi" }
//       '''
//       defaultContainer 'playwright'
//     }
//   }
//
// All 5 stages, parameters, environment vars, and post block are unchanged.
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

    // ── Runtime Parameters ───────────────────────────────────────────────────
    // Select test scope at build time via "Build with Parameters".
    // Default is 'sanity' for fast feedback on every commit.
    parameters {
        choice(
            name:        'TEST_SCOPE',
            choices:     ['sanity', 'regression', 'motors', 'property', 'home', 'all'],
            description: 'Which test suite to run. Maps to npm test:* scripts or full suite.'
        )
        booleanParam(
            name:         'SKIP_HISTORY',
            defaultValue: false,
            description:  'Skip restoring Allure history (useful when debugging a fresh run).'
        )
    }

    environment {
        BASE_URL = 'https://www.trademe.co.nz'
        CI       = 'true'
    }

    options {
        ansiColor('xterm')              // Renders ANSI colour codes from npm/playwright output
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '30'))
        timeout(time: 45, unit: 'MINUTES')  // Regression + retries:2 can exceed 30 min
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
            when {
                not { expression { return params.SKIP_HISTORY } }
            }
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
        // Exit code semantics:
        //   0  → all tests passed           → build stays GREEN
        //   1  → some tests failed          → build marked UNSTABLE (reports still run)
        //   2+ → infrastructure/config error → build marked FAILURE (pipeline aborts)
        stage('Run Tests') {
            steps {
                script {
                    def scopeMap = [
                        sanity:     'npm run test:sanity',
                        regression: 'npm run test:regression',
                        motors:     'npm run test:motors',
                        property:   'npm run test:property',
                        home:       'npm run test:home',
                        all:        'npx playwright test'
                    ]
                    def cmd = scopeMap[params.TEST_SCOPE] ?: 'npx playwright test'
                    echo "Running: ${cmd}"

                    def exitCode = sh(script: cmd, returnStatus: true)
                    if (exitCode == 1) {
                        currentBuild.result = 'UNSTABLE'
                        echo 'Tests completed with failures — build marked UNSTABLE.'
                    } else if (exitCode != 0) {
                        currentBuild.result = 'FAILURE'
                        error("Test runner exited with unexpected code: ${exitCode}")
                    }
                }
            }
        }

        // ── 4. Generate Allure Report ────────────────────────────────────────
        stage('Generate Allure Report') {
            steps {
                sh 'npx allure generate allure-results --clean -o allure-report'
                // Snapshot history so the next build's Restore stage can use it
                sh 'mkdir -p allure-history && cp -r allure-report/history/. allure-history/'
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
                    reportTitles:          "Build ${env.BUILD_NUMBER} — ${params.TEST_SCOPE}"
                ])
            }
        }
    }

    post {
        always {
            echo "Build ${env.BUILD_NUMBER} (scope: ${params.TEST_SCOPE}) finished — ${currentBuild.currentResult}"
        }
        unstable {
            echo 'One or more tests failed. Open the Allure Report for step-level details and failure screenshots.'
        }
        failure {
            echo 'Pipeline infrastructure error. Check stage logs above.'
        }
        cleanup {
            // Clean workspace on success/abort; preserve on failure/unstable for ad-hoc debugging.
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
