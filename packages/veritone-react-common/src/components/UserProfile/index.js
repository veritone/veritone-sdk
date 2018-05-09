import React from 'react';
import cx from 'classnames';
import { string, func } from 'prop-types';
import Header from './HeaderBar/Header'
import Profile from './Profile/Profile'
import PersonalInfo from './PersonalInfo/PersonalInfo'

import classes from './styles.scss';

export default class UserProfile extends React.Component {
    static propTypes = {
        firstName: string,
        lastName: string,
        email: string,

    }
    language = {
        headerTitle: "My Account",
        profileGreeting: "Welcome",
    }

  render() {
    return (
        <div className={classes.content}>
            <Header title={this.language.headerTitle}/>
            <Profile 
                greeting = {this.language.profileGreeting} 
                firstName = {this.props.firstName} 
                lastName = {this.props.lastName} 
            />
            <PersonalInfo
                firstName = {this.props.firstName} 
                lastName = {this.props.lastName} 
            />
        </div>
    )
  }
}