import React from 'react';
import { storiesOf } from '@storybook/react';

import UserProfile from './';

storiesOf('UserProfile', module).add('Base', () => (
    <UserProfile 
        firstName="brian"
        lastName="gilkey"
        email="bgilkey@veritone.com"
        passwordLastUpdated="2017-04-07T22:10:30.230Z"
    />
));
