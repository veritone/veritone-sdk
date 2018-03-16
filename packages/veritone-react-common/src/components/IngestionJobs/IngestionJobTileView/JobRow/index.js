import React from 'react';

import {
  bool,
  any,
  string
} from 'prop-types';

import {
  Checkbox,
} from 'components/formComponents';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

import styles from './styles.scss';

export default class JobRow extends React.Component {
  static propTypes = {
    checkAll: bool,
    name: string,
    status: string,
    adapter: string,
    ingestionType: string,
    creationDate: string,
    lastIngested: string
  };

  static defaultProps = {};

  state = {
    checked: this.props.checkAll || false,
  };

  handleCheckboxChange = () => {
    this.setState({
      checked: !this.state.checked
    });
  };

  componentWillReceiveProps(nextProps) {
    this.setState({checked: nextProps.checkAll});
  };

  handleRowClick = (event) => {
    console.log('row clicked');
  };

  render() {
    return (
      <div className={styles.tableRow} >
        <Checkbox
          input={{
            onChange: this.handleCheckboxChange,
            value: this.state.checked
          }}
          className={styles.checkbox}
          label=''
        />
        <div className={styles.rowTextGroup} onClick={this.handleRowClick}>
          <span className={styles.columnText}>{this.props.name}</span>
          <span className={styles.columnText}>{this.props.status}</span>
          <span className={styles.columnText}>{this.props.adapter}</span>
          <span className={styles.columnText}>{this.props.ingestionType}</span>
          <span className={styles.columnText}>{this.props.creationDate}</span>
          <span className={styles.columnText}>{this.props.lastIngested}</span>
        </div>
        <IconButton className={styles.menuIcon} aria-label='menu'>
          <Icon className={'icon-more_vert'}></Icon>
        </IconButton>
      </div>
    );
  };
};




