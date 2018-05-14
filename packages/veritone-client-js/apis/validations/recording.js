import validatejs from 'validate.js';

export default function validateRecording(recording) {
  if (typeof recording !== 'object') {
    throw new Error('Missing recording!');
  }

  const validation = {
    startDateTime: {
      presence: true,
      numericality: {
        onlyInteger: true
      }
    },
    stopDateTime: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThan: recording.startDateTime
      }
    }
  };
  const validationErrors = validatejs(recording, validation);
  if (validationErrors) {
    throw new Error(
      'Invalid recording object: ' + JSON.stringify(validationErrors)
    );
  }
}
