import { expect } from 'chai';
import nock from 'nock';
nock.disableNetConnect();

import VeritoneApi from '../index.js';

const apiBaseUri = 'http://fake.domain';

describe('ApiClient constructor', function() {
	it('can be configured with a string (token for auth header)', function() {
		const api = new VeritoneApi('testToken');

		expect(api.generateHeaders().Authorization).to.match(/testToken/);
	});

	it('throws if no token is configured', function() {
		expect(() => new VeritoneApi()).to.throw();
		expect(() => new VeritoneApi({})).to.throw();
		expect(() => new VeritoneApi('testToken')).not.to.throw();
		expect(() => new VeritoneApi({ token: 'testToken' })).not.to.throw();
	});
});

describe('API methods', function() {
	beforeEach(function() {
		this.api = new VeritoneApi({
			token: 'api-token-abc',
			baseUri: apiBaseUri
		});
	});

	afterEach(function() {
		nock.cleanAll();
	});

	describe('Token', function() {
		describe('createToken', function() {
			it('validates label', function() {
				const incorrectLabels = [undefined, () => {}, ''];
				const correctLabels = ['ok'];

				incorrectLabels.forEach(l => {
					expect(() => this.api.createToken(l, 'a', () => {})).to.throw();
				});

				correctLabels.forEach(l => {
					expect(() => this.api.createToken(l, 'a', () => {})).not.to.throw();
				});
			});

			it('validates rights', function() {
				const incorrectRights = [undefined, ''];
				const correctRights = ['rights']; // todo: string or array?

				incorrectRights.forEach(r => {
					expect(() => this.api.createToken('label', r, () => {})).to.throw();
				});

				correctRights.forEach(r => {
					expect(() =>
						this.api.createToken('label', r, () => {})
					).not.to.throw();
				});
			});

			it('validates callback', function() {
				const incorrectCallbacks = [undefined, ''];
				const correctCallbacks = [() => {}];

				incorrectCallbacks.forEach(c => {
					expect(() => this.api.createToken('label', 'a', c)).to.throw();
				});

				correctCallbacks.forEach(c => {
					expect(() => this.api.createToken('label', 'a', c)).not.to.throw();
				});
			});

			it('posts to API with tokenLabel and rights in json body', function(
				done
			) {
				const scope = nock(apiBaseUri)
					.post(/token/, {
						tokenLabel: 'label',
						rights: 'rights'
					})
					.reply(200, 'ok');

				this.api.createToken('label', 'rights', () => {
					scope.done();
					done();
				});
			});
		});

		describe('revokeToken', function() {
			it('validates token', function() {
				const incorrectTokens = [undefined, () => {}, ''];
				const correctTokens = ['ok'];

				incorrectTokens.forEach(l => {
					expect(() => this.api.createToken(l, 'a', () => {})).to.throw();
				});

				correctTokens.forEach(l => {
					expect(() => this.api.createToken(l, 'a', () => {})).not.to.throw();
				});
			});

			it('makes a delete request to the api with the token', function(done) {
				const scope = nock(apiBaseUri).delete(/some-token/).reply(200, 'ok');

				this.api.revokeToken('some-token', () => {
					scope.done();
					done();
				});
			});
		});

		describe('revokeToken', function() {
			it('validates token', function() {
				const incorrectTokens = [undefined, () => {}, ''];
				const correctTokens = ['ok'];

				incorrectTokens.forEach(l => {
					expect(() => this.api.createToken(l, 'a', () => {})).to.throw();
				});

				correctTokens.forEach(l => {
					expect(() => this.api.createToken(l, 'a', () => {})).not.to.throw();
				});
			});

			it('makes a delete request to the api with the token', function(done) {
				const scope = nock(apiBaseUri).delete(/some-token/).reply(200, 'ok');

				this.api.revokeToken('some-token', () => {
					scope.done();
					done();
				});
			});
		});
	});
});
