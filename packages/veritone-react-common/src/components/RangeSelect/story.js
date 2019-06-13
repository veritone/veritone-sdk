import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import RangeSelect from './';

class Story extends React.Component {
    state = {
        selectedConfidenceRange: [25, 100]
    }
    onChangeConfidenceRange = (e) => {
        this.setState({
            selectedConfidenceRange: [...e]
        })
    }
    render() {
        return (
            <div>
                <RangeSelect onChangeConfidenceRange={this.onChangeConfidenceRange} selectedConfidenceRange={this.state.selectedConfidenceRange} />
            </div>
        )
    }
}


const selectedConfidenceRange = [20, 75];

storiesOf('Range Select', module)
    .add('Simple test', () => (<Story />));

