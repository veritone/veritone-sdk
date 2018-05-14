import { expect } from 'chai';

import RetryHelper from './RetryHelper';

describe('RetryHelper', function() {
  it('should have defaults', function(done) {
    const retryHelper = new RetryHelper();
    expect(retryHelper._maxRetries).to.equal(1);
    expect(retryHelper._retryIntervalMs).to.equal(50);
    done();
  });

  it('should load settings', function(done) {
    const retryHelper = new RetryHelper({ maxRetries: 3, retryIntervalMs: 10 });
    expect(retryHelper._maxRetries).to.equal(3);
    expect(retryHelper._retryIntervalMs).to.equal(10);
    done();
  });

  it('should have function "retry"', function(done) {
    const retryHelper = new RetryHelper({ maxRetries: 3 });
    expect(retryHelper.retry).to.exist;
    expect(typeof retryHelper.retry).to.equal('function');
    done();
  });

  it('should run once', function(done) {
    const retryHelper = new RetryHelper({ maxRetries: 3 });
    let runCount = 0;

    function task(cb) {
      if (typeof cb !== 'function') {
        throw new Error('Invalid cb value!');
      }

      runCount++;
      cb(null, 'whee');
    }

    retryHelper.retry(task, function(err, results) {
      expect(err).not.to.exist;
      expect(results).to.equal('whee');
      expect(runCount).to.equal(1);

      done();
    });
  });

  it('should run three times', function(done) {
    const retryHelper = new RetryHelper({ maxRetries: 3, retryIntervalMs: 25 });
    let runCount = 0;

    function task(cb) {
      if (typeof cb !== 'function') {
        throw new Error('Invalid cb value!');
      }

      runCount++;
      if (runCount < 3) {
        cb('error');
      } else {
        cb(null, 'whee');
      }
    }

    retryHelper.retry(task, function(err, results) {
      expect(err).not.to.exist;
      expect(results).to.equal('whee');
      expect(runCount).to.equal(3);

      done();
    });
  });

  it('should run and return error', function(done) {
    const retryHelper = new RetryHelper({ maxRetries: 3, retryIntervalMs: 25 });

    function task(cb) {
      if (typeof cb !== 'function') {
        throw new Error('Invalid cb value!');
      }

      cb('error');
    }

    retryHelper.retry(task, function(err, results) {
      expect(err).to.equal('error');
      expect(results).not.to.exist;

      done();
    });
  });
});
