# passport-veritone
Passport strategy for authenticating with Veritone using the OAuth 2.0 API.


## Install

    $ npm install passport-veritone

## Usage
Please see the [veritone sample app](https://github.com/veritone/veritone-sample-app-react/blob/develop/server.js) for a working implementation

```javascript
const passport = require('passport');
const Strategy = require('passport-veritone');

const app = express();
app.use(passport.initialize());

passport.use(new Strategy({
  clientID: 'my-veritone-application-id',
  clientSecret: 'my-veritone-application-oauth2-secret',
  callbackURL: 'http://local.veritone.com:9000/auth/veritone/callback'
}, function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));


app.get('/auth/veritone', passport.authenticate('veritone'));

app.get('/auth/veritone/callback',
  passport.authenticate('veritone', { session: false }), (req, res) => {
    res
      .cookie('oauthToken', req.user.oauthToken, {
        secure: false,
        httpOnly: false
      })
      .redirect(302, `http://local.veritone.com:3000`);
  });
```


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
