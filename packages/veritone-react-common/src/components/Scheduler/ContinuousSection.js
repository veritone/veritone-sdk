import React, { Fragment } from 'react';
import { formValues, Field } from 'redux-form';
import { bool } from 'prop-types';

import DateTimeSelector from './DateTimeSelector';
import Checkbox from '../formComponents/Checkbox';
import styles from './styles.scss';

export default class ContinuousSection extends React.Component {
  static propTypes = {
    readOnly: bool
  };

  render() {
    return (
      <Fragment>
        <div className={styles.formSectionRow}>
          <DateTimeSelector name="start" label="Starts" showIcon readOnly={this.props.readOnly} />
        </div>
        <div className={styles.formSectionRow}>
          <DateTimeSelector name="end" label="Ends" showIcon readOnly={this.props.readOnly} />
        </div>
      </Fragment>
    );
  }
}
