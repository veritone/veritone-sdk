import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';

import AreaInterest from './';
class Story extends Component {

    state = {
        defaultAoI: {
            id: 'test id',
            boundingPoly: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 0, y: 1 }
            ]
        }
    }

    onEditAoI = () => {
        console.log('this.onEditAoI');
    }

    onRemoveAoI = () => {
        console.log('this.onRemoveAoI');
    }
    render() {
        return (
            <AreaInterest areaOfInterest={this.state.defaultAoI} onEditAoI={this.onEditAoI} onRemoveAoI={this.onRemoveAoI} />
        )
    }
}

storiesOf('AreaInterest', module)
    .add('Simple test', () => <Story />);

