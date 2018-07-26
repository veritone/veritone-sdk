import React from 'react';
import { connect } from 'react-redux';
import { string, shape, object, func, bool } from 'prop-types';

import BackIcon from '@material-ui/icons/KeyboardBackspace';
import InfoSection from './InfoSection';

import styles from './styles.scss';

import * as engineSelectionModule from '../../../redux/modules/engineSelection';

@connect(
  (state, ownProps) => ({
    isSelected: engineSelectionModule.engineIsSelected(
      state,
      ownProps.engine.id,
      ownProps.id
    )
  }),
  {
    selectEngines: engineSelectionModule.selectEngines,
    deselectEngines: engineSelectionModule.deselectEngines
  }
)
export default class EngineDetailView extends React.Component {
  static propTypes = {
    id: string.isRequired,
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
    selectEngines: func.isRequired,
    deselectEngines: func.isRequired
  };

  static defaultProps = {};

  render() {
    return (
      <div className={styles.detailsContainer}>
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
            id={this.props.id}
            engine={this.props.engine}
            onAdd={this.props.selectEngines}
            onRemove={this.props.deselectEngines}
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
