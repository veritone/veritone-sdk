## Configuration (local testing)
1. Create a Veritone application using the instructions [here](http://docs.veritone.com/#/applications/quick-start/step-1). 
   * In the URL field, use `http://localhost:3000/`
   * In the OAuth2 Redirect URL field, use `http://localhost:5001/auth/veritone/callback`

2. Configure veritone-widgets-server to use the app you just created:
   * In this repo, fill in the blanks in the `.env.development` file, referencing the values found in your app's configuration page in Developer App:
     * **NODE_PORT**: The port on which the widgets server will run. This should match the port on your callback URL.
     * **CLIENT_ID**: Your application's ID (from Developer App).
     * **CLIENT_SECRET**: Your application's OAuth2 client secret (from Developer App).
     * **CALLBACK_URL**: your application's registered callback URL as configured in Developer App (http://localhost:5001/auth/veritone/callback)
     * **CLIENT_ORIGIN**: Your application's frontend URL. This should match the URL you configured for your application in Developer App.

3. Run veritone-widgets server
   * `yarn start`


# License
Copyright 2019, Veritone Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.