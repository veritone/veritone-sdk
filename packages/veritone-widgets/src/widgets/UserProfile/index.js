import React from 'react';
import { connect } from 'react-redux';
import { startCase, noop, isEmpty, get } from 'lodash';
import { string, func, bool, shape, any } from 'prop-types';
import { withProps, branch, renderNothing } from 'recompose';
import {
  reduxForm,
  Form,
  reset as resetForm,
  submit as submitForm,
  reducer as formReducer
} from 'redux-form';

import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/styles';

import { Avatar } from 'veritone-react-common';
import { modules } from 'veritone-redux-common';
const {
  user: {
    resetUserPassword,
    updateCurrentUserProfile,
    selectUser,
    selectUserOrganizationKvp
  }
} = modules;
import widget from '../../shared/widget';
import FilePicker from '../FilePicker';
import PersonalInfoField from './PersonalInfoField';
import PasswordField from './PasswordField';
import ChangeNameModal from './Modals/ChangeName';
import ResetPasswordModal from './Modals/ResetPassword';

import styles from './styles';
const defaultAvatarImg =
  'https://static.veritone.com/veritone-ui/default-avatar.png';
const formNameSpace = 'form';

@connect(
  state => ({
    user: selectUser(state),
    enablePasswordReset:
      get(
        selectUserOrganizationKvp(state),
        'features.oktaAuthentication.enabled',
        false
      ) !== true
  }),
  {
    resetForm,
    submitForm,
    resetUserPassword,
    updateCurrentUserProfile
  }
)
@branch(
  // do not render if we don't have a user
  props => isEmpty(props.user),
  renderNothing
)
@withProps(props => ({
  initialValues: {
    firstName: props.user.kvp.firstName,
    lastName: props.user.kvp.lastName,
    email: props.user.email
  }
}))
@reduxForm({
  form: 'userProfile',
  validate: values => {
    let errors = {};

    if (!values.firstName) {
      errors.firstName = 'Cannot be empty';
    }

    if (!values.lastName) {
      errors.lastName = 'Cannot be empty';
    }

    return errors;
  }
})
@withStyles(styles)
export class UserProfile extends React.Component {
  static propTypes = {
    user: shape({
      kvp: shape({
        firstName: string.isRequired,
        lastName: string.isRequired,
        lastPasswordUpdated: string
      }).isRequired,
      email: string,
      signedImageUrl: string
    }),
    resetForm: func.isRequired,
    submitForm: func.isRequired,
    handleSubmit: func.isRequired,
    resetUserPassword: func.isRequired,
    updateCurrentUserProfile: func.isRequired,
    onUserUpdated: func,
    invalid: bool,
    pristine: bool,
    submitting: bool,
    enablePasswordReset: bool,
    classes: shape({ any }),
  };

  static defaultProps = {
    onUserUpdated: noop,
    enablePasswordReset: true
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

  openChangeAvatarModal = () => {
    this.setState({
      currentModal: 'changeAvatar'
    });
  };

  closeModal = () => {
    this.setState({
      currentModal: null
    });
  };

  cancelChanges = () => {
    this.closeModal();
    this.props.resetForm('userProfile');
  };

  submitChanges = () => {
    this.props.submitForm('userProfile');
  };

  handleResetPassword = () => {
    return this.props
      .resetUserPassword()
      .catch(noop)
      .then(this.afterChange);
  };

  handleUpdateUser = vals => {
    return this.props
      .updateCurrentUserProfile(vals)
      .catch(noop)
      .then(this.afterChange);
  };

  handleUpdateImage = ([result], { error }) => {
    if (error) {
      // file picker upload error, messaging handled by picker itself
      return;
    }

    return this.handleUpdateUser({
      imageUrl: result.unsignedUrl
    });
  };

  afterChange = userResponse => {
    const updatedUser = get(userResponse, 'updateCurrentUser');
    if (updatedUser) {
      this.props.onUserUpdated(updatedUser);
    }
    this.closeModal();
  };

  getUserFullName = () => {
    return startCase(
      `${this.props.user.kvp.firstName} ${this.props.user.kvp.lastName}`
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <Form
        onSubmit={this.props.handleSubmit(this.handleUpdateUser)}
        className={classes.container}
      >
        <div className={classes.column}>
          <div className={classes.section}>
            <FilePicker
              accept={['image/*']}
              multiple={false}
              allowUrlUpload={false}
              onPick={this.handleUpdateImage}
              // eslint-disable-next-line
              renderButton={({ handlePickFiles }) => (
                <Avatar
                  src={this.props.user.signedImageUrl || defaultAvatarImg}
                  label="Change"
                  onClick={handlePickFiles}
                />
              )}
            />
          </div>

          <div className={classes.section}>
            <Typography
              variant="h6"
              gutterBottom
              classes={{ root: classes.title }}
            >
              Your Personal Info
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              classes={{ root: classes.subheading }}
            >
              Manage your basic information.
            </Typography>

            <PersonalInfoField
              name={this.getUserFullName()}
              email={this.props.user.email}
              onEditName={this.openChangeNameModal}
              onEditEmail={this.openChangeEmailModal}
            />
          </div>
          {this.props.enablePasswordReset === true && (
            <div className={classes.section}>
              <Typography
                variant="h6"
                gutterBottom
                classes={{ root: classes.title }}
              >
                Signing in to Veritone
            </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                classes={{ root: classes.subheading }}
              >
                Control your password and account access.
            </Typography>

              <PasswordField
                lastUpdated={this.props.user.lastPasswordUpdated}
                onEdit={this.openChangePasswordModal}
              />
            </div>
          )}
          <ChangeNameModal
            open={this.state.currentModal === 'changeName'}
            onConfirm={this.submitChanges}
            onCancel={this.cancelChanges}
            disableConfirm={
              this.props.invalid || this.props.pristine || this.props.submitting
            }
          />

          <ResetPasswordModal
            open={this.state.currentModal === 'changePassword'}
            onConfirm={this.handleResetPassword}
            onCancel={this.cancelChanges}
          />
        </div>
      </Form>
    );
  }
}

const SlideDown =
  React.forwardRef((slideProps, ref) => (
    <Slide ref={ref} direction="down" {...slideProps} />
  ));

class UserProfileDialog extends React.Component {
  static propTypes = {
    open: bool,
    title: string,
    onClose: func,
    onUserUpdated: func
  };

  static defaultProps = {
    onClose: noop
  };

  state = {
    openedByWidgetInstanceMethod: false
  };

  open = () => {
    this.setState({
      openedByWidgetInstanceMethod: true
    });
  };

  close = () => {
    this.setState({
      openedByWidgetInstanceMethod: false
    });
  };

  handleClose = () => {
    this.close();
    this.props.onClose();
  };

  render() {
    let { open, title, ...profileProps } = this.props;
    return (
      <Dialog
        fullScreen
        open={open || this.state.openedByWidgetInstanceMethod}
        TransitionComponent={SlideDown}
      >
        <AppBar position="fixed">
          <Toolbar>
            <IconButton color="inherit" onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit">
              {title}
            </Typography>
          </Toolbar>
        </AppBar>

        <UserProfile {...profileProps} />
      </Dialog>
    );
  }
}

const UserProfileWidget = widget(UserProfileDialog);
export { UserProfileDialog as default, UserProfileWidget, formNameSpace, formReducer };
