/**
 * Module dependencies.
 */
var util = require('util');
var OAuth2Strategy = require('passport-oauth2');
var InternalOAuthError = require('passport-oauth2').InternalOAuthError;

/**
 * Creates an instance of `Strategy`.
 *
 * @constructor
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL =
    options.authorizationURL ||
    'https://api.veritone.com/v1/admin/oauth/authorize';
  options.tokenURL =
    options.tokenURL || 'https://api.veritone.com/com/v1/admin/oauth/token';
  options.scopeSeparator = options.scopeSeparator || ' ';
  OAuth2Strategy.call(this, options, verify);
  this.name = 'veritone';
  this._profileUrl =
    options.profileUrl || 'https://api.veritone.com/v1/admin/current-user';
  this._oauth2.useAuthorizationHeaderforGET(true);
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve current user from Veritone.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `veritone`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this._profileUrl, accessToken, function(err, body, res) {
    var json;

    if (err) {
      return done(new InternalOAuthError('Failed to fetch current user', err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse current user', ex));
    }

    var profile = json;
    profile.provider = 'veritone';
    profile.oauthToken = accessToken;

    return done(null, profile);
  });
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
