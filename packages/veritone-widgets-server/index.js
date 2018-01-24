const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const Strategy = require('passport-veritone');
const ejs = require('ejs');

const app = express();

dotenv.config({ path: '.env.development' });

const settings = {
  environment: process.env.NODE_ENV || 'development',
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
  const errorMessage = err.message || err.toString() || 'Unknown Passport-Veritone error';
  res.render('oauth_error', { clientOrigin: settings.clientOrigin, environment: settings.environment, error: errorMessage });
  next();
};

app.get('/auth/veritone', passport.authenticate('veritone'));

app.get(
  '/auth/veritone/callback',
  passport.authenticate('veritone', { session: false }),
  (req, res) => {
    if (!settings.clientOrigin) {
      console.error('Must specify the client origin for safety');
    }
    res.render('oauth', {
      oauthToken: req.user.oauthToken,
      clientOrigin: settings.clientOrigin,
      environment: settings.environment,
    });
  }
);

app.use(oauthError);

// start server
// --------------------------------
app.listen(settings.port, err => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('🐬  Veritone-widgets-server is listening at on port %s', settings.port);
});
