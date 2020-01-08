import React from 'react';
import { connect } from 'react-redux';
import { bool, object, func, string, shape, any } from 'prop-types';
import { get } from 'lodash';

import { Lozenge, Truncate } from 'veritone-react-common';

import { modules } from 'veritone-redux-common';
const { engine: engineModule } = modules;

import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/styles';

import networkIsolatedLogo from '../../../images/networkisolated_logo.png';
import externalAccessLogo from '../../../images/externalaccess_logo.png';
import externalProcessingLogo from '../../../images/externalprocessing_logo.png';
import humanReviewLogo from '../../../images/humanreview_logo.png';

import * as engineSelectionModule from '../../../../../redux/modules/engineSelection';

import ToggleButton from '../../../ToggleButton/';

import styles from './styles';

@withStyles(styles)
@connect(
  (state, ownProps) => ({
    isSelected: engineSelectionModule.engineIsSelected(
      state,
      ownProps.engineId,
      ownProps.id
    ),
    engine: engineModule.getEngine(state, ownProps.engineId),
    isChecked: engineSelectionModule.engineIsChecked(
      state,
      ownProps.engineId,
      ownProps.id
    )
  }),
  {
    selectEngines: engineSelectionModule.selectEngines,
    deselectEngines: engineSelectionModule.deselectEngines,
    checkEngine: engineSelectionModule.checkEngine,
    uncheckEngine: engineSelectionModule.uncheckEngine
  }
)
export default class EngineSelectionRow extends React.Component {
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
    isChecked: bool.isRequired,
    onViewDetail: func.isRequired,
    selectEngines: func.isRequired,
    deselectEngines: func.isRequired,
    checkEngine: func.isRequired,
    uncheckEngine: func.isRequired,
    classes: shape({ any }),
  };

  handleChange = () => {
    this.props.isChecked
      ? this.props.uncheckEngine(this.props.id, this.props.engine.id)
      : this.props.checkEngine(this.props.id, this.props.engine.id);
  };

  handleClick = () => {
    this.props.onViewDetail(this.props.engine);
  };

  render() {
    const { classes } = this.props;
    const { name, iconClass, color } = this.props.engine.category || {};

    const deploymentModelLogo = {
      FullyNetworkIsolated: networkIsolatedLogo,
      MostlyNetworkIsolated: externalAccessLogo,
      NonNetworkIsolated: externalProcessingLogo,
      HumanReview: humanReviewLogo
    };

    return (
      <div className={classes.row}>
        <div className={classes.avatar}>
          {this.props.engine.iconPath ? (
            <img className={classes.icon} src={this.props.engine.iconPath} />
          ) : (
              <i className="icon-engines" />
            )}
          <div className={classes.engineSelect}>
            <Checkbox
              color="primary"
              onChange={this.handleChange}
              checked={this.props.isChecked}
            />
          </div>
        </div>
        <div className={classes.container}>
          <div className={classes.primary}>
            <div className={classes.main}>
              <div className={classes.headings}>
                <div className={classes.title} onClick={this.handleClick}>
                  {this.props.engine.name}
                </div>
                <div className={classes.orgName}>
                  {get(this.props, 'engine.ownerOrganization.name')}
                </div>
              </div>
            </div>
            <div className={classes.info}>
              {name && (
                <Lozenge iconClassName={iconClass} backgroundColor={color}>
                  {name}
                </Lozenge>
              )}
            </div>
            <div className={classes.description}>
              {this.props.engine.description && (
                <Truncate clamp={3}>{this.props.engine.description}</Truncate>
              )}
            </div>
          </div>
          <div className={classes.secondary}>
            <div className={classes.logos}>
              <div className={classes.logo}>
                <img
                  className={classes.icon}
                  src={deploymentModelLogo[this.props.engine.deploymentModel]}
                />
              </div>
            </div>
            <div>
              <ToggleButton
                id={this.props.id}
                onAdd={this.props.selectEngines}
                onRemove={this.props.deselectEngines}
                engineId={this.props.engine.id}
                isSelected={this.props.isSelected}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
