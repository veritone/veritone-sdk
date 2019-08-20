#!groovy

@Library('jenkins-scripts@master') _

def call(body) {
    def config = [:]
    body.resolveStrategy = Closure.DELEGATE_FIRST
    body.delegate = config
    body()

    pipeline {
        agent { node { label "linux" } }

        options {
            timestamps()
            timeout(time: 90, unit: 'MINUTES')
            disableConcurrentBuilds()
        }

        stages
        {
            stage('Setup Environment')
            {
                steps {
                    script {
                        sh "echo Setting Commit ID"
                        sh "git rev-parse --short HEAD > .git/commit-id"
                        commit_id = readFile('.git/commit-id')
                        env.GIT_COMMIT = commit_id
                        env.GIT_REPO_NAME = "${GIT_URL.reverse().tokenize('/')[0].reverse()[0..-5]}"

                        withCredentials([string(credentialsId: 'GITHUB_TOKEN', variable: 'GITHUB_TOKEN')]) {
                            sh """
                                #!/bin/bash
                                git config --global url."https://${GITHUB_TOKEN}:x-oauth-basic@github.com/".insteadOf "https://github.com/"
                                git fetch --tags
                                git config --add remote.origin.fetch +refs/heads/master:refs/remotes/origin/master
                                git fetch origin master
                            """
                        }

                        prod_tags = getMatchingTags("prod")
                        env.LATEST_PROD_TAG = prod_tags[0]
                        env.PREVIOUS_PROD_TAG = prod_tags[1]
                        sh "echo LATEST_PROD_TAG = ${LATEST_PROD_TAG}"
                        sh "echo PREVIOUS_PROD_TAG = ${PREVIOUS_PROD_TAG}"

                        sh "echo PROD_BASELINE_CHANGED_FILE_PATHS"
                        PROD_BASELINE_CHANGED_FILE_PATHS = getGitDiffChangedFilePaths(GIT_COMMIT, PREVIOUS_PROD_TAG)

                        sh "echo STAGE_BASELINE_CHANGED_FILE_PATHS"
                        STAGE_BASELINE_CHANGED_FILE_PATHS = getGitDiffChangedFilePaths(GIT_COMMIT, LATEST_PROD_TAG)

                        sh "git branch -a"
                        sh "echo MASTER_BASELINE_CHANGED_FILE_PATHS"
                        MASTER_BASELINE_CHANGED_FILE_PATHS = getGitDiffChangedFilePaths("remotes/origin/master", "remotes/origin/master~1")

                        PULL_REQUEST_URL = getGitPullRequest(GIT_REPO_NAME, GIT_COMMIT)
                    }
                }
            }
            stage("Execute Scripts 'DEV'") {
                when {
                    beforeAgent true
                    allOf {
                        anyOf {
                            expression { BRANCH_NAME == 'master' }
                        }
                    }
                }

                parallel {
                    stage("dev") {
                        agent { node { label 'linux' } }

                        environment {
                            ENVIRONMENT = "dev"
                        }

                        steps {
                            println "execute database target change scripts"
                        }
                    }
                }
            }
        }
        post {
            always {
                notifier(currentBuild.result)
            }
        }
    }
}
