# veritone-client-js changelog

## 1.0.3
* initial version published to NPM

## 1.0.4
* Fixes "Token is required" when creating a client, even if an oauth token is supplied.

## 1.0.5
* Fixes `job.getJobsForRecording()` to use the correct token type

# 1.1.0
* No longer requires a token to be provided at startup. If no token is provided, API calls will not include an Authorization header
* Ran prettier over the codebase with our common settings.

# 2.0.1
* update lodash

# 3.0.1
* update axios