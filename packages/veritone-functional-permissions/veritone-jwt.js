const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');

module.exports = function init(app) {
	function VeritoneJwt(subject, payload) {
		if (!new.target) {
			return new VeritoneJwt(subject, payload);
		}

		if (!subject) {
			throw new Error('subject is missing');
		}

		this.id = uuid();
		this.subject = subject;
		this.payload = payload || {};
		this.payload.scope = this.payload.scope || [];
	}

	VeritoneJwt.prototype.getToken = function getToken() {
		const token = jwt.sign(this.payload, app.config.jwt.secret, {
			expiresIn: app.config.jwt.ttl || '7d',
			jwtid: this.id,
			subject: this.subject
		});

		// keep an eye on token size
		if (token.length > 8192) {
			app.logger.warn('VeritoneJwt token size greater than 8k: ' + token.length, this.payload);
		}

		return token;
	};

	VeritoneJwt.prototype.toString = VeritoneJwt.prototype.getToken;

	return VeritoneJwt;
};
