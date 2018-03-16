import React from 'react';

import {
  string,
  bool,
  arrayOf,
  number,
  any,
  objectOf
} from 'prop-types';

import {
  Checkbox,
} from 'components/formComponents';
import { MenuItem } from 'material-ui/Menu';

import JobRow from './JobRow';

import styles from './styles.scss';

export default class IngestionJobTileView extends React.Component {
  static propTypes = {
    jobInfo: arrayOf(objectOf(any))
  };

  static defaultProps = {

  };

  state = {
    checkedAll: false,
  };

  handleCheckboxChange = () => {
    this.setState({
      checkedAll: !this.state.checkedAll
    });
  };

  render() {
    const jobRows = this.props.jobInfo.map((row, index) => {
      return <JobRow checkAll={this.state.checkedAll} rowInfo={row} key={index} />
    });
    return (
      <div>
        <div className={styles.tableTitleRow}>
          <Checkbox
            input={{
              onChange: this.handleCheckboxChange,
              value: this.state.checkedAll
            }}
            className={styles.checkbox}
            label=''
          />
          <div className={styles.titleTextGroup}>
            <span className={styles.tableTitle}>Job name</span>
            <span className={styles.tableTitle}>Schema</span>
            <span className={styles.tableTitle}>Start</span>
          </div>
          <div style={{width: '55px'}}></div>
        </div>
        {jobRows}
      </div>
    );
  };
}