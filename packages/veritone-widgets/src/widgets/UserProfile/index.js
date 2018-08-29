import React from 'react';
import { connect } from 'react-redux';
import { startCase } from 'lodash';
import { string, func, bool } from 'prop-types';
import { withProps } from 'recompose';
import { reduxForm, reset } from 'redux-form';

import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import { Avatar } from 'veritone-react-common';
import PersonalInfoField from './PersonalInfoField';
import PasswordField from './PasswordField';
import ChangeNameModal from './Modals/ChangeName';
import ResetPasswordModal from './Modals/ResetPassword';

import styles from './styles.scss';

@connect(null, { reset })
@withProps(props => ({
  initialValues: {
    firstName: props.firstName,
    lastName: props.lastName,
    email: props.email
  }
}))
@reduxForm({
  form: 'userProfile'
})
export class UserProfile extends React.Component {
  static propTypes = {
    firstName: string,
    lastName: string,
    email: string.isRequired,
    imageUrl: string,
    passwordUpdatedDateTime: string,
    reset: func.isRequired
  };

  static defaultProps = {
    imageUrl: '//static.veritone.com/veritone-ui/default-avatar-2.png'
  };

  state = {
    currentModal: null
  };

  openChangeNameModal = () => {
    this.setState({
      currentModal: 'changeName'
    });
  };

  openChangeEmailModal = () => {
    this.setState({
      currentModal: 'changeEmail'
    });
  };

  openChangePasswordModal = () => {
    this.setState({
      currentModal: 'changePassword'
    });
  };

  closeModal = () => {
    this.setState({
      currentModal: null
    });
  };

  cancelChanges = () => {
    this.closeModal();
    this.props.reset();
  };

  confirmChanges = () => {
    console.log('changes confirmed');
  };

  handleResetPassword = () => {
    console.log('reset password');
  };

  getUserFullName = () => {
    return startCase(`${this.props.firstName} ${this.props.lastName}`);
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.column}>
          <div className={styles.section}>
            <Avatar
              src={this.props.imageUrl}
              label="Change"
              onClick={this.handleChangeAvatar}
            />

            <Typography variant="subheading" className={styles.greeting}>
              Welcome, {this.getUserFullName()}
            </Typography>
          </div>

          <div className={styles.section}>
            <Typography
              variant="title"
              gutterBottom
              classes={{ root: styles.title }}
            >
              Your Personal Info
            </Typography>
            <Typography
              variant="subheading"
              gutterBottom
              classes={{ root: styles.subheading }}
            >
              Manage this basic information - your name and email.
            </Typography>

            <PersonalInfoField
              name={this.getUserFullName()}
              email={this.props.email}
              onEditName={this.openChangeNameModal}
              onEditEmail={this.openChangeEmailModal}
            />
          </div>

          <div className={styles.section}>
            <Typography
              variant="title"
              gutterBottom
              classes={{ root: styles.title }}
            >
              Signing in to Veritone
            </Typography>
            <Typography
              variant="subheading"
              gutterBottom
              classes={{ root: styles.subheading }}
            >
              Control your password and account access.
            </Typography>

            <PasswordField
              lastUpdated={this.props.passwordUpdatedDateTime}
              onEdit={this.openChangePasswordModal}
            />
          </div>

          <ChangeNameModal
            open={this.state.currentModal === 'changeName'}
            firstName={this.props.firstName}
            lastName={this.props.lastName}
            onConfirm={this.confirmChanges}
            onCancel={this.cancelChanges}
          />

          <ResetPasswordModal
            open={this.state.currentModal === 'changePassword'}
            onConfirm={this.handleResetPassword}
            onCancel={this.cancelChanges}
          />
        </div>
      </div>
    );
  }
}

function SlideDown(props) {
  return <Slide direction="down" {...props} />;
}

const UserProfileDialog = ({ open, title, onClose, ...profileProps }) => (
  <Dialog fullScreen open={open} TransitionComponent={SlideDown}>
    <AppBar position="fixed">
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
