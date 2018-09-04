import React from 'react';
import { shape, string, arrayOf } from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { formComponents } from 'veritone-react-common';
import { startCase } from 'lodash';

import wizardConfig from '../wizard-config';
import styles from '../../styles/wizard.scss';

const { TextField, Checkbox } = formComponents;


@reduxForm({
  form: wizardConfig.formName,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true
})
export default class ClusterDetails extends React.Component {
  static propTypes = {
    fields: shape({
      name: string.isRequired,
      metrics: string.isRequired
    }).isRequired,
    metrics: arrayOf(string).isRequired
  };

  render() {
    const { fields } = this.props;

    return (
      <div className={styles['cluster-wizard-view']}>
        <div className={styles['cluster-heading']}>
          <div>
            <p className={styles['cluster-subheading']}>General</p>
            <span className={styles['cluster-text']}>
              Name your cluster and provide an email for Veritone to send update
              notifications.
            </span>
          </div>
          <div className={styles['help-text']}>
            <span className="icon-help2" />
            <span>
              Need help? Check out the{' '}
              <a href="#">How to Configure Nodes in aiWARE On-Premise</a>
            </span>
          </div>
        </div>
        <div className="cluster-details-name">
          <Field
            name={fields.name}
            component={TextField}
            label="Cluster Name"
            maxLength={50}
          />
        </div>
        <div className={styles['cluster-details-metrics']}>
          <div>
            <p className={styles['cluster-subheading']}>Sending Data</p>
            <span className={styles['cluster-text']}>
              Send Veritone your data
            </span>
          </div>
          <div>
            {this.props.metrics.map(metric => (
              <Field
                key={metric}
                name={`${fields.metrics}.${metric}`}
                label={startCase(metric)}
                component={Checkbox}
                labelProps={{
                  classes: {
                    label: styles['cluster-details-metric']
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
