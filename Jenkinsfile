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

                        PULL_REQUEST_URL = getGitPullRequest(GIT_REPO_NAME, GIT_COMMIT)
                    }
                }
            }
            stage("Build") {
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
                            println "build "
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
