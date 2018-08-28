import React from 'react';
import { isBoolean, startCase } from 'lodash';
import { string, func, bool } from 'prop-types';
import { format as libFormat } from 'date-fns';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import { Avatar } from 'veritone-react-common';
import PersonalInfo from './PersonalInfo/PersonalInfo';
import Password from './Password/Password';
import ChangeName from './Modals/ChangeName/ChangeName';
import ResetPassword from './Modals/ResetPassword/ResetPassword';
import Notification from './Notifications/Notifications';

import styles from './styles.scss';

export class UserProfile extends React.Component {
  static propTypes = {
    firstName: string,
    lastName: string,
    email: string.isRequired,
    imageUrl: string,
    passwordUpdatedDateTime: string,
    handleNameChangeRequest: func.isRequired,
    handlePasswordResetRequest: func.isRequired
  };

  static defaultProps = {
    imageUrl: '//static.veritone.com/veritone-ui/default-avatar-2.png'
  };

  state = {
    firstName: this.props.firstName,
    firstNameDirty: this.props.firstName,
    lastName: this.props.lastName,
    lastNameDirty: this.props.lastName,
    lastUpdated: libFormat(this.props.passwordLastUpdated, 'MMMM DD, YYYY'),
    changeNameModalOpen: false,
    requestPasswordRestModalOpen: false,
    filePickerOpen: false,
    notificationToShow: false
  };

  handleFirstNameChange = event => {
    this.setState({ firstNameDirty: event.target.value });
  };

  handleLastNameChange = event => {
    this.setState({ lastNameDirty: event.target.value });
  };

  handlePasswordResetRequest = () => {
    const success = () =>
      this.setState({
        requestPasswordRestModalOpen: false,
        notificationToShow: 'passwordRequestSent'
      });

    const failure = err => {
      console.error('Password reset call error:', err);
      this.setState({
        requestPasswordRestModalOpen: 'error',
        changeNameModalOpen: false
      });
    };

    Promise.resolve()
      .then(this.props.handlePasswordResetRequest())
      .then(() => success())
      .catch(() => failure());
  };

  handleChangeModalToggle = setState => {
    const current = this.state.changeNameModalOpen;

    if (isBoolean(setState)) {
      this.setState({ changeNameModalOpen: setState });
    } else {
      this.setState({ changeNameModalOpen: !current });
    }
  };

  handleRequestResetModalToggle = setState => {
    if (isBoolean(setState)) {
      this.setState({ requestPasswordRestModalOpen: setState });
    } else {
      const current = this.state.requestPasswordRestModalOpen;
      this.setState({ requestPasswordRestModalOpen: !current });
    }
  };

  handleChangeAvatar = () => {
    console.log('file picker open');
  };

  showNotification = messageKey =>
    this.setState({ notificationToShow: messageKey });

  hideNotification = () => {
    if (this.state.notificationToShow) {
      this.setState({ notificationToShow: null });
    }
  };

  handleNameChangeSubmit = () => {
    const success = () => {
      this.setState(state => ({
        firstName: state.firstNameDirty,
        lastName: state.lastNameDirty,
        notificationToShow: 'nameChanged',
        changeNameModalOpen: false
      }));
    };

    const failure = err => {
      console.error('Change Name call faile with error:', err);
      this.setState({
        notificationToShow: 'error',
        changeNameModalOpen: false
      });
    };

    Promise.resolve()
      .then(() =>
        this.props.handleNameChangeRequest({
          firstName: this.state.firstNameDirty,
          lastName: this.state.lastNameDirty
        })
      )
      .then(() => success())
      .catch(() => failure());
  };

  getUserName = () => {
    return startCase(`${this.props.firstName} ${this.props.lastName}`);
  };

  render() {
    return (
      <div className={styles.container}>
        <Avatar
          src={this.props.imageUrl}
          label="Change"
          onClick={this.handleChangeAvatar}
        />

        <Typography variant="subheading" className={styles.greeting}>
          Welcome, {this.getUserName()}
        </Typography>

        <PersonalInfo
          firstName={this.state.firstName}
          lastName={this.state.lastName}
          email={this.props.email}
          handleChangeModalToggle={this.handleChangeModalToggle}
          handleNameChangeSubmit={this.handleNameChangeSubmit}
        />
        <Password
          lastUpdated={this.state.lastUpdated}
          handleRequestResetModalToggle={this.handleRequestResetModalToggle}
        />
        <ChangeName
          firstName={this.state.firstNameDirty}
          lastName={this.state.lastNameDirty}
          open={this.state.changeNameModalOpen}
          handleFirstNameChange={this.handleFirstNameChange}
          handleLastNameChange={this.handleLastNameChange}
          handleSubmit={this.handleNameChangeSubmit}
          handleClose={this.handleChangeModalToggle}
        />
        <ResetPassword
          open={this.state.requestPasswordRestModalOpen}
          requestReset={this.handlePasswordResetRequest}
          closeHandler={this.handleRequestResetModalToggle}
        />
        <Notification
          onClose={this.hideNotification}
          messageKey={this.state.notificationToShow}
        />
      </div>
    );
  }
}

function SlideDown(props) {
  return <Slide direction="down" {...props} />;
}

const UserProfileDialog = ({ open, title, onClose, ...profileProps }) => (
  <Dialog fullScreen open={open} TransitionComponent={SlideDown}>
    <AppBar position="static">
      <Toolbar>
        <IconButton color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <Typography variant="title" color="inherit">
          {title}
        </Typography>
      </Toolbar>
    </AppBar>

    <UserProfile {...profileProps} />
  </Dialog>
);

UserProfileDialog.propTypes = {
  open: bool,
  title: string,
  onClose: func
};

export default UserProfileDialog;
