import React from 'react';
import cx from 'classnames';
import { string, func } from 'prop-types';
import { format as libFormat } from 'date-fns';

import Header from './HeaderBar/Header';
import Profile from './Profile/Profile';
import PersonalInfo from './PersonalInfo/PersonalInfo';
import Password from './Password/Password';
import ChangeName from './Modals/ChangeName/ChangeName';
import ResetPassword from './Modals/ResetPassword/ResetPassword';

import classes from './styles.scss';

export default class UserProfile extends React.Component {
    static propTypes = {
        firstName: string,
        lastName: string,
        email: string.isRequired,
        passwordLastUpdated: string,
        handleNameChange: func.isRequired,
        handlePasswordResetRequest: func.isRequired
    }

    language = {
        headerTitle: "My Account",
        profileGreeting: "Welcome",
    }

    state = {
        firstName: this.props.firstName,
        firstNameDirty: this.props.firstName,
        lastName: this.props.lastName,
        lastNameDirty: this.props.lastName,
        lastUpdated: libFormat(this.props.passwordLastUpdated, 'MMMM DD, YYYY'),
        changeNameModalOpen: false,
        requestPasswordRestModalOpen: false,
    }

    handleFirstNameChange = event => {
        this.setState({ firstNameDirty: event.target.value });
    }

    handleLastNameChange = event => {
        this.setState({ lastNameDirty: event.target.value });
    }

    handlePasswordResetRequest = () => {
        this.props.handlePasswordResetRequest();
        this.setState({requestPasswordRestModalOpen: false})
    }

    handleChangeModalToggle = (setState) => {
        const current = setState || this.state.changeNameModalOpen;
        this.setState({changeNameModalOpen: !current});
    }

    handleRequestResetModalToggle = () => {
        const current = this.state.requestPasswordRestModalOpen;
        this.setState({requestPasswordRestModalOpen: !current});
    }

    handleNameChangeSubmit = () => {
        this.props.handleNameChangeRequest({
            firstName: this.state.firstNameDirty,
            lastName: this.state.lastNameDirty,
        });
        this.setState({
            firstName: this.state.firstNameDirty,
            lastName: this.state.lastNameDirty
        });
        this.handleChangeModalToggle(false);
    }

    render() {
        return (
            <div className={classes.content}>
                <Header title={this.language.headerTitle} />
                <Profile
                    greeting={this.language.profileGreeting}
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}/>
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
            </div>
        )
    }
}