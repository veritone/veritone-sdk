import React from 'react';
import { connect } from 'react-redux';
import { string, shape, object, func, bool } from 'prop-types';

import BackIcon from '@material-ui/icons/KeyboardBackspace';
import InfoSection from './InfoSection';

import * as engineSelectionModule from '../../../redux/modules/engineSelection';
import { withStyles } from '../../../shared/withStyles';
import styles from './styles';

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
    const classes = withStyles(styles);
    return (
      <div className={classes.detailsContainer}>
        <div className={classes.back}>
          <div
            className={classes.backBtn}
            onClick={this.props.onCloseDetailView}
          >
            <BackIcon />
            <span>Back</span>
          </div>
        </div>
        <div className={classes.content}>
          <InfoSection
            id={this.props.id}
            engine={this.props.engine}
            onAdd={this.props.selectEngines}
            onRemove={this.props.deselectEngines}
            isSelected={this.props.isSelected}
          />
          <div className={classes.description}>
            <div className={classes.sectionHeading}>Description</div>
            <div className={classes.descriptionContent}>
              {this.props.engine.description}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
