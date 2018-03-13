import React from 'react';
import { connect } from 'react-redux';
import { string, shape, object, func, bool } from 'prop-types';

import BackIcon from 'material-ui-icons/KeyboardBackspace';
import InfoSection from './InfoSection';

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
    engine: shape({
      id: string.isRequired,
      name: string.isRequired,
      category: object,
      description: string,
      iconPath: string,
      ownerOrganization: object
    }).isRequired,
    isSelected: bool.isRequired,
    onCloseDetailView: func.isRequired,
    addEngines: func.isRequired,
    removeEngines: func.isRequired
  };

  static defaultProps = {
    engine: {}
  };

  render() {
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
        </div>
      </div>
    );
  }
}
