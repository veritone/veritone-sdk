import React from 'react';
import cx from 'classnames';
import { string, func } from 'prop-types';
import { format as libFormat } from 'date-fns';

import FilePicker from 'components/FilePicker';

import Header from './HeaderBar/Header';
import Profile from './Profile/Profile';
import PersonalInfo from './PersonalInfo/PersonalInfo';
import Password from './Password/Password';
import ChangeName from './Modals/ChangeName/ChangeName';
import ResetPassword from './Modals/ResetPassword/ResetPassword';
import Notification from './Notification/Notification';

import classes from './styles.scss';

export default class UserProfile extends React.Component {
    static propTypes = {
        firstName: string,
        lastName: string,
        email: string.isRequired,
        passwordLastUpdated: string,
        handleNameChangeRequest: func.isRequired,
        handlePasswordResetRequest: func.isRequired,
        close: func.isRequired,
    }

    state = {
        firstName: this.props.firstName,
        firstNameDirty: this.props.firstName,
        lastName: this.props.lastName,
        lastNameDirty: this.props.lastName,
        lastUpdated: libFormat(this.props.passwordLastUpdated, 'MMMM DD, YYYY'),
        changeNameModalOpen: false,
        requestPasswordRestModalOpen: false,
        filePickerOpen: false,
        notificationToShow: false,
    }

    handleFirstNameChange = event => {
        this.setState({ firstNameDirty: event.target.value });
    }

    handleLastNameChange = event => {
        this.setState({ lastNameDirty: event.target.value });
    }

    handlePasswordResetRequest = () => {
        const success = () => this.setState({
            requestPasswordRestModalOpen: false,
            notificationToShow: 'passwordRequestSent'
        });

        const failure = (err) => {
            console.error('Password reset call error:', err);
            this.setState({
                requestPasswordRestModalOpen: 'error',
                changeNameModalOpen: false,
            });
        }

        Promise.resolve()
            .then(this.props.handlePasswordResetRequest())
            .then(() => success())
            .catch(() => failure());
    }

    handleChangeModalToggle = (setState) => {
        const current = this.state.changeNameModalOpen;
        
        if (typeof(setState) === "boolean") {
            this.setState({changeNameModalOpen: setState});
        } else {
            this.setState({changeNameModalOpen: !current});
        }
    }

    handleRequestResetModalToggle = (setState) => {
        if (typeof(setState) === "boolean") {
            this.setState({requestPasswordRestModalOpen: setState});
        } else {
            const current = this.state.requestPasswordRestModalOpen;
            this.setState({requestPasswordRestModalOpen: !current});
        }
    }

    handleFilePickerOpen = () => {
        console.log('file picker open');
    }

    showNotification = (messageKey) => this.setState({notificationToShow: messageKey});

    hideNotificaiton = () => {
        if (this.state.notificationToShow) {
            this.setState({notificationToShow: null});
        }
    }

    handleNameChangeSubmit = () => {
        const success = () => {
            this.setState({
                firstName: this.state.firstNameDirty,
                lastName: this.state.lastNameDirty,
                notificationToShow: 'nameChanged',
                changeNameModalOpen: false,
            });
        }

        const failure = (err) => {
            console.error('Change Name call faile with error:', err);
            this.setState({
                notificationToShow: 'error',
                changeNameModalOpen: false,
            })
        }

        Promise.resolve()
            .then(() => this.props.handleNameChangeRequest({
                firstName: this.state.firstNameDirty,
                lastName: this.state.lastNameDirty,
            }))
            .then(() => success())
            .catch(() => failure());
    }

    render() {
        return (
            <div className={classes.content}>
                <Header close={this.props.close}/>
                <Profile
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    filePickerHandler={this.handleFilePickerOpen}/>
                <PersonalInfo
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    email={this.props.email}
                    handleChangeModalToggle={this.handleChangeModalToggle}
                    handleNameChangeSubmit={this.handleNameChangeSubmit}/>
                <Password
                    lastUpdated={this.state.lastUpdated}
                    handleRequestResetModalToggle={this.handleRequestResetModalToggle}/>
                <ChangeName 
                    firstName={this.state.firstNameDirty}
                    lastName={this.state.lastNameDirty}
                    open={this.state.changeNameModalOpen}
                    handleFirstNameChange={this.handleFirstNameChange}
                    handleLastNameChange={this.handleLastNameChange}
                    handleSubmit={this.handleNameChangeSubmit}
                    handleClose={this.handleChangeModalToggle} />
                <ResetPassword
                    open={this.state.requestPasswordRestModalOpen}
                    requestReset={this.handlePasswordResetRequest}
                    closeHandler={this.handleRequestResetModalToggle}/>
                <Notification
                    onClose={this.hideNotificaiton}
                    messageKey={this.state.notificationToShow}/>
            </div>
        )
    }
}