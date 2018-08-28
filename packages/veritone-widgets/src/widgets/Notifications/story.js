import React from 'react';
import { connect } from 'react-redux';
import { func } from 'prop-types';
import { storiesOf } from '@storybook/react';
import Button from '@material-ui/core/Button';

import BaseStory from '../../shared/BaseStory';
import GlobalNotificationDialog from './GlobalNotificationDialog';
import GlobalSnackBar from './GlobalSnackBar';
import {
  showNotification,
  showDialogNotification
} from '../../redux/modules/notifications';

@connect(null, {
  showNotification,
  showDialogNotification
})
class Story extends React.Component {
  static propTypes = {
    showNotification: func.isRequired,
    showDialogNotification: func.isRequired
  };

  handleShowSnackBarNotification = () => {
    this.props.showNotification(
      `The current time is: ${new Date().toLocaleTimeString()}`
    );
  };

  handleShowDialogNotification = () => {
    this.props.showDialogNotification(
      'Welcome to the Veritone SDK',
      `The current time is: ${new Date().toLocaleTimeString()}`
    );
  };

  render() {
    return (
      <div>
        <Button onClick={this.handleShowSnackBarNotification}>
          Show a snackbar notification
        </Button>

        <Button onClick={this.handleShowDialogNotification}>
          Show a dialog notification
        </Button>
        <GlobalNotificationDialog />
        <GlobalSnackBar />
      </div>
    );
  }
}

storiesOf('Notifications', module).add('Base', () => {
  return <BaseStory componentClass={Story} />;
});
