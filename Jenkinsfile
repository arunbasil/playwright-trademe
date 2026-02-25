// ─────────────────────────────────────────────────────────────────────────────
// Jenkins Declarative Pipeline — TradeMe Playwright Tests + Allure Reporting
//
// Required plugins (Manage Jenkins → Plugins):
//   • docker-workflow        → dockerfile agent support
//   • copyartifact           → Allure trend history between builds
//   • allure-jenkins-plugin  → Official Allure plugin (replaces htmlpublisher for reports)
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
                // --with-deps is not needed: the Microsoft Playwright base image
                // already includes all system dependencies for Chromium.
                sh 'npx playwright install chromium'
            }
        }

        // ── 2. Run Tests ─────────────────────────────────────────────────────
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

        // ── 4. Publish Allure Report ─────────────────────────────────────────
        // The official Allure plugin generates AND serves the report natively
        // inside Jenkins — no CSP/iframe issues unlike htmlpublisher.
        // It also handles trend history automatically across builds.
        stage('Publish Allure Report') {
            steps {
                // Archive traces/screenshots for debugging
                archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true

                // Official Allure plugin — reads allure-results/ directly
                allure([
                    includeProperties: false,
                    jdk:               '',
                    results:           [[path: 'allure-results']],
                    report:            'allure-report',
                    reportBuildPolicy: 'ALWAYS'
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
