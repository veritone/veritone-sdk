import React from 'react';
import { string, func } from 'prop-types';

import Snackbar from 'material-ui/Snackbar';

const Notifications = ({ messageKey, onClose }) => {
  const messages = {
    nameChanged: 'Your Name has successfully been Updated',
    passwordRequestSent: 'A password rest link has been sent to your email',
    error:
      'we are sorry, there was a problem with your request. Please try again later'
  };
  const messageToDisplay = messages[messageKey];

  const shouldShow = messageKey ? true : false;

  return (
    <Snackbar
      open={shouldShow}
      onClose={onClose}
      message={messageToDisplay}
      autoHideDuration={4000}
    />
  );
};

Notifications.proptypes = {
  messageKey: string,
  onClose: func.isRequired
};

export default Notifications;
