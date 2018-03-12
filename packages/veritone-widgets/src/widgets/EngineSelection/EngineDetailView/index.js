import React from 'react';
import { objectOf, any, func } from 'prop-types';

import styles from './styles.scss';

import InfoSection from './InfoSection';
import DetailSection from './DetailSection';

import BackIcon from 'material-ui-icons/KeyboardBackspace';

export default class EngineDetailView extends React.Component {
  static propTypes = {
    engine: objectOf(any).isRequired,
    onClose: func.isRequired
  };

  static defaultProps = {
    engine: {}
  };

  render() {
    const sections = {
      basics: [
        {
          title: 'Server Country',
          value: 'United States'
        },
        {
          title: 'Version',
          value: 14.04
        },
        {
          title: 'Last Updated',
          value: 'N/A'
        }
      ],
      security: [
        {
          title: 'Encrypted in Flight',
          value: 'N/A'
        },
        {
          title: 'Deletes Data After Process',
          value: 'N/A'
        },
        {
          title: 'Network Isolated',
          value: 'N/A'
        },
        {
          title: 'CJIS Compliant',
          value: 'N/A'
        },
        {
          title: 'PCI Compliant',
          value: 'N/A'
        },
        {
          title: 'FedRamp Compliant',
          value: 'N/A'
        }
      ],
      performance: [
        {
          title: 'CPU Profile',
          value: 'N/A'
        },
        {
          title: 'Avg Memory',
          value: 'N/A'
        },
        {
          title: 'Max Memory',
          value: 'N/A'
        },
        {
          title: 'Max Concurrency',
          value: 'N/A'
        }
      ],
      files: [
        {
          title: 'Filetypes Supported',
          value: 'N/A'
        },
        {
          title: 'Max File Size',
          value: 'N/A'
        }
      ]
    };

    return (
      <div>
        <div className={styles.back} onClick={this.props.onClose}>
          <div className={styles.backBtn}>
            <BackIcon />
            <span>Back</span>
          </div>
        </div>
        <div className={styles.content}>
          <InfoSection engine={this.props.engine} />
          <div className={styles.description}>
            <div className={styles.sectionHeading}>Description</div>
            <div className={styles.descriptionContent}>
              {this.props.engine.description}
            </div>
          </div>
          <hr />
          <div className={styles.details}>
            <div className={styles.sectionHeading}>Engine Details</div>
            <div className={styles.detailsContent}>
              {Object.entries(sections).map(section => (
                <DetailSection section={section} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
