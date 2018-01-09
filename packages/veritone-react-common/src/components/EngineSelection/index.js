import React from 'react';
import { string, node } from 'prop-types';

// import styles from './styles.scss';
import EngineSelectionRow from './EngineSelectionRow';

export default class EngineSelection extends React.Component {
  static propTypes = {
  };

  render() {
    // const { } = this.props;

    return (
      <div>
        <EngineSelectionRow />
        <EngineSelectionRow />
        <EngineSelectionRow />
      </div>
    );
  }
}
