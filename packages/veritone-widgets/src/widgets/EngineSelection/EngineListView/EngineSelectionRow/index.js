import React from 'react';
import { connect } from 'react-redux';
import { string, object, func } from 'prop-types';

import LibCheckbox from 'material-ui/Checkbox';

import cjisLogo from '../../images/CJIS_logo.png';
import fedrampLogo from '../../images/fedramp_logo.png';
import networkIsolatedLogo from '../../images/networkisolated_logo.png';
import externalAccessLogo from '../../images/externalaccess_logo.png';
import externalProcessingLogo from '../../images/externalprocessing_logo.png';
import humanReviewLogo from '../../images/humanreview_logo.png';

import { Lozenge, Price, Ellipsis, StarRating } from 'veritone-react-common';

import * as engineSelectionModule from '../../../../redux/modules/engineSelection';

import ToggleButton from '../../ToggleButton/';

import styles from './styles.scss';

@connect(
  (state, ownProps) => ({
    isSelected: engineSelectionModule.engineIsSelected(
      state,
      ownProps.engine.id
    ),
    isChecked: engineSelectionModule.engineIsChecked(state, ownProps.engine.id)
  }),
  {
    addEngines: engineSelectionModule.addEngines,
    removeEngines: engineSelectionModule.removeEngines,
    checkEngine: engineSelectionModule.checkEngine,
    uncheckEngine: engineSelectionModule.uncheckEngine
  },
  null,
  { withRef: true }
)
export default class EngineSelectionRow extends React.Component {
  static propTypes = {
    engine: object,
    showDetailView: func.isRequired
  };

  handleOnChange = () => {
    this.props.isChecked
      ? this.props.uncheckEngine(this.props.engine.id)
      : this.props.checkEngine(this.props.engine.id);
  };

  handleOnClick = () => {
    this.props.showDetailView(this.props.engine);
  };

  render() {
    const { name, iconClass } = this.props.engine.category || {};

    const deploymentModelLogo = {
      FullyNetworkIsolated: networkIsolatedLogo,
      MostlyNetworkIsolated: externalAccessLogo,
      NonNetworkIsolated: externalProcessingLogo,
      HumanReview: humanReviewLogo
    };

    return (
      <div className={styles.row}>
        <div className={styles.avatar}>
          {this.props.engine.iconPath && (
            <img src={this.props.engine.iconPath} />
          )}
          {!this.props.engine.iconPath && <i className="icon-engines" />}
          {/* <img src={this.props.engine.iconPath} />
          <div>
            <i className="icon-engines" />
          </div> */}
          <div className={styles.engineSelect}>
            <LibCheckbox
              onChange={this.handleOnChange}
              checked={this.props.isChecked}
            />
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.primary}>
            <div className={styles.main}>
              <div className={styles.headings}>
                <div className={styles.title} onClick={this.handleOnClick}>
                  {this.props.engine.name}
                </div>
                <div className={styles.orgName}>
                  {this.props.engine.ownerOrganization.name}
                </div>
              </div>
              <Price amount={this.props.engine.price} />
            </div>
            <div className={styles.info}>
              <Lozenge type={name} icon={iconClass} />
              <StarRating rating={this.props.engine.rating} />
            </div>
            <div className={styles.description}>
              {this.props.engine.description}
              {/* <Ellipsis /> */}
            </div>
          </div>
          <div className={styles.secondary}>
            <div className={styles.logos}>
              <div className={styles.logo}>
                <img src={cjisLogo} />
              </div>
              <div className={styles.logo}>
                <img src={fedrampLogo} />
              </div>
              <div className={styles.logo}>
                <img
                  src={deploymentModelLogo[this.props.engine.deploymentModel]}
                />
              </div>
            </div>
            <div>
              <ToggleButton
                onAdd={this.props.addEngines}
                onRemove={this.props.removeEngines}
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
