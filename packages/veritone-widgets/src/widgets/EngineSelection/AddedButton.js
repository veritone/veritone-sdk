import React from 'react';
import { string, node } from 'prop-types';

import Button from 'material-ui/Button';
import Add from 'material-ui-icons/Add';

import styles from './styles.scss';

export default class AddedButton extends React.Component {
  static propTypes = {
  };

  render() {
    // const { } = this.props;
    return (
      <Button style={{ backgroundColor: '#2196f3', borderRadius: '4px', padding: '8px 13px' }} raised color="primary">
        <Add style={{ marginRight: '5px' }}/>
        Add Engine
      </Button>
    );
  }
}