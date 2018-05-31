import { expect } from 'chai';

import validate from './recording';

describe('recording validation', function() {
  it('validates recording', function() {
    const incorrectRecordings = [
      'asdf',
      { startDateTime: 2 },
      { stopDateTime: 2 },
      { startDateTime: 2, stopDateTime: 3.1 }, // not integer
      { startDateTime: 2, stopDateTime: 1 } // start after stop
    ];
    const correctRecordings = [{ startDateTime: 1, stopDateTime: 2 }];

    incorrectRecordings.forEach(r => {
      expect(() => validate(r)).to.throw();
    });

    correctRecordings.forEach(r => {
      expect(() => validate(r)).not.to.throw();
    });
  });
});
