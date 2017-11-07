const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const Strategy = require('passport-veritone');
const ejs = require('ejs');

const app = express();

dotenv.config({ path: '.env.development' });

const settings = {
  host: process.env.host || '127.0.0.1',
  port: process.env.NODE_PORT || 5001,
  clientOrigin: process.env.CLIENT_ORIGIN,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
};

app.use(passport.initialize());
app.set('view engine', 'ejs');

passport.use(new Strategy({
  clientID: settings.clientId,
  clientSecret: settings.clientSecret,
  callbackURL: settings.callbackURL
}, function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));
const oauthError = (err, req, res, next) => {
  console.log("Passport-Veritone OAuth2 Error", err);
  res.render('oauth_error', { clientOrigin: settings.clientOrigin });
  next();
};

app.get('/auth/veritone', passport.authenticate('veritone'));

app.get(
  '/auth/veritone/callback',
  passport.authenticate('veritone', { session: false }),
  (req, res) => {
    if (!settings.clientOrigin) {
      console.error('Must specifiy the client origin for safety');
    }
    res.render('oauth', {
      oauthToken: req.user.oauthToken,
      clientOrigin: settings.clientOrigin
    });
  }
);

app.use(oauthError);

// start server
// --------------------------------
app.listen(settings.port, settings.host, err => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('🐬  Veritone-widgets-server is listening at http://%s:%s', settings.host, settings.port);
});
