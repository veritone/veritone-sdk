import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, select as selectKnob } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import ChangeName from './Modals/ChangeName/ChangeName';
import ResetPassword from './Modals/ResetPassword/ResetPassword';
import Notification from './Notifications/Notifications';
import UserProfile from './';

storiesOf('UserProfile', module)
  .add('Base', () => (
    <UserProfile
      firstName="brian"
      lastName="gilkey"
      email="bgilkey@veritone.com"
      passwordLastUpdated="2017-04-07T22:10:30.230Z"
      handleNameChangeRequest={action('Name Change Submitted')}
      handlePasswordResetRequest={action('Password Reset Request Submitted')}
      open={boolean('open', true)}
    />
  ))
  .add('Change Name Modal', () => {
    const openModal = boolean('openNameModal', true);
    const closeHandler = action('Close Name Change Modal');
    const handleFirstNameChange = action(`new first name will be changed to`);
    const handleLastNameChange = action(`new last name will be changed to`);
    const handleSubmit = action('Name Change Submitted');
    const handleClose = action('Name Change Closed');

    return (
      <ChangeName
        firstName="brian"
        lastName="gilkey"
        open={openModal}
        closeHandler={closeHandler}
        handleFirstNameChange={handleFirstNameChange}
        handleLastNameChange={handleLastNameChange}
        handleSubmit={handleSubmit}
        handleClose={handleClose}
      />
    );
  })
  .add('Request Password Modal', () => {
    const openModal = boolean('openPasswordModal', true);
    const requestReset = action('Password Reset Requested');
    const closeHandler = action('Close Password ResetModal');

    return (
      <ResetPassword
        open={openModal}
        requestReset={requestReset}
        closeHandler={closeHandler}
      />
    );
  })
  .add('Notifications', () => {
    const selectOptions = {
      changedName: 'changedName',
      passwordRequestSent: 'passwordRequestSent',
      error: 'error'
    };

    const onClose = action('Notification Closed');
    const message = selectKnob('message to show', selectOptions, 'changedName');

    return <Notification onClose={onClose} message={message} />;
  });
