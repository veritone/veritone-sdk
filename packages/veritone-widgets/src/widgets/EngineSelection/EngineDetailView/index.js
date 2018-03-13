import React from 'react';
import { connect } from 'react-redux';
import { objectOf, any, func, bool } from 'prop-types';

import BackIcon from 'material-ui-icons/KeyboardBackspace';
import InfoSection from './InfoSection';
// import DetailSection from './DetailSection';

import styles from './styles.scss';

import * as engineSelectionModule from '../../../redux/modules/engineSelection';

@connect(
  (state, ownProps) => ({
    isSelected: engineSelectionModule.engineIsSelected(
      state,
      ownProps.engine.id
    )
  }),
  {
    addEngines: engineSelectionModule.addEngines,
    removeEngines: engineSelectionModule.removeEngines
  }
)
export default class EngineDetailView extends React.Component {
  static propTypes = {
    engine: objectOf(any).isRequired,
    isSelected: bool.isRequired,
    onCloseDetailView: func.isRequired,
    addEngines: func.isRequired,
    removeEngines: func.isRequired
  };

  static defaultProps = {
    engine: {}
  };

  render() {
    // const sections = {
    //   basics: [
    //     {
    //       title: 'Server Country',
    //       value: 'United States'
    //     },
    //     {
    //       title: 'Version',
    //       value: 'N/A'
    //     },
    //     {
    //       title: 'Last Updated',
    //       value: 'N/A'
    //     }
    //   ],
    //   security: [
    //     {
    //       title: 'Encrypted in Flight',
    //       value: 'N/A'
    //     },
    //     {
    //       title: 'Deletes Data After Process',
    //       value: 'N/A'
    //     },
    //     {
    //       title: 'Network Isolated',
    //       value: 'N/A'
    //     },
    //     {
    //       title: 'CJIS Compliant',
    //       value: 'N/A'
    //     },
    //     {
    //       title: 'PCI Compliant',
    //       value: 'N/A'
    //     },
    //     {
    //       title: 'FedRamp Compliant',
    //       value: 'N/A'
    //     }
    //   ],
    //   performance: [
    //     {
    //       title: 'CPU Profile',
    //       value: 'N/A'
    //     },
    //     {
    //       title: 'Avg Memory',
    //       value: 'N/A'
    //     },
    //     {
    //       title: 'Max Memory',
    //       value: 'N/A'
    //     },
    //     {
    //       title: 'Max Concurrency',
    //       value: 'N/A'
    //     }
    //   ],
    //   files: [
    //     {
    //       title: 'Filetypes Supported',
    //       value: 'N/A'
    //     },
    //     {
    //       title: 'Max File Size',
    //       value: 'N/A'
    //     }
    //   ]
    // };

    return (
      <div>
        <div className={styles.back}>
          <div
            className={styles.backBtn}
            onClick={this.props.onCloseDetailView}
          >
            <BackIcon />
            <span>Back</span>
          </div>
        </div>
        <div className={styles.content}>
          <InfoSection
            engine={this.props.engine}
            onAdd={this.props.addEngines}
            onRemove={this.props.removeEngines}
            isSelected={this.props.isSelected}
          />
          <div className={styles.description}>
            <div className={styles.sectionHeading}>Description</div>
            <div className={styles.descriptionContent}>
              {this.props.engine.description}
            </div>
          </div>
          {/* <hr />
          <div className={styles.details}>
            <div className={styles.sectionHeading}>Engine Details</div>
            <div className={styles.detailsContent}>
              {Object.entries(sections).map(section => (
                <DetailSection section={section} />
              ))}
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}
