import React from 'react';

import {
  bool,
  any,
  objectOf
} from 'prop-types';

import {
  Checkbox,
} from 'components/formComponents';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

import styles from './styles.scss';

export default class DataSetRow extends React.Component {
  static propTypes = {
    checkedAll: bool,
    rowInfo: objectOf(any)
  };

  static defaultProps = {

  };

  state = {
    checked: false,
  };

  handleCheckboxChange = () => {
    this.setState({
      checked: !this.state.checked
    });
  };

  render() {
    return (
      <div className={styles.tableRow}>
        <Checkbox
          input={{
            onChange: this.handleCheckboxChange,
            value: this.state.checkedAll
          }}
          className={styles.checkbox}
          label=''
        />
        <div className={styles.rowTextGroup}>
          <span className={styles.columnText}>{this.props.rowInfo.jobName}</span>
          <span className={styles.columnText}>{this.props.rowInfo.schema}</span>
          <span className={styles.columnText}>{this.props.rowInfo.startTime}</span>
        </div>
        <IconButton className={styles.menuIcon} aria-label='menu'>
          <Icon className={'icon-more_vert'}></Icon>
        </IconButton>
      </div>
    );
  };
};




