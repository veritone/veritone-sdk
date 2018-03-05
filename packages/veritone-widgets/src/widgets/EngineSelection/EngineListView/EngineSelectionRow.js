import React from 'react';
import { connect } from 'react-redux';
import { string, object, func } from 'prop-types';

import LibCheckbox from 'material-ui/Checkbox';

import cjisLogo from '../images/CJIS_logo.png';
import fedrampLogo from '../images/fedramp_logo.png';
import networkIsolatedLogo from '../images/networkisolated_logo.png';

import { Lozenge, Price, Ellipsis, StarRating } from 'veritone-react-common';

import * as engineSelectionModule from '../../../redux/modules/engineSelection';

import ToggleButton from '../ToggleButton';

import styles from './styles.scss';


@connect(
  (state, ownProps) => ({
    isSelected: engineSelectionModule.engineIsSelected(state, ownProps.engine.id),
    isChecked: engineSelectionModule.engineIsChecked(state, ownProps.engine.id)
  }),
  {
    addEngine: engineSelectionModule.addEngine,
    removeEngine: engineSelectionModule.removeEngine,
    checkEngine: engineSelectionModule.checkEngine,
    uncheckEngine: engineSelectionModule.uncheckEngine,
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
    this.props.isChecked ?
      this.props.uncheckEngine(this.props.engine.id) :
      this.props.checkEngine(this.props.engine.id);
  }

  handleOnClick = () => {
    this.props.showDetailView(this.props.engine)
  }

  render() {
    const { name, iconClass } = this.props.engine.category || {};

    return (
      <div className={styles.engineSelectionRow}>
        <div className={styles.avatar}>
          <img src={this.props.engine.iconPath || "http://www.crimsy.com/images/100x100.PNG"} />
          <div className={styles.engineSelect}>
            <LibCheckbox onChange={this.handleOnChange} checked={this.props.isChecked} />
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.main}>
              <div className={styles.headings}>
                <div className={styles.title} onClick={this.handleOnClick}>{this.props.engine.name}</div>
                <div className={styles.subTitle}>{this.props.engine.ownerOrganization.name}</div>
              </div>
              <Price />
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
          <div className={styles.select}>
            <div className={styles.logos}>
              <div className={styles.logo}>
                <img src={cjisLogo} />
              </div>
              <div className={styles.logo}>
                <img src={fedrampLogo} />
              </div>
              <div className={styles.logo}>
                <img src={networkIsolatedLogo} />
              </div>
            </div>
            <div className={styles.button}>
              <ToggleButton
                onAdd={this.props.addEngine}
                onRemove={this.props.removeEngine}
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
