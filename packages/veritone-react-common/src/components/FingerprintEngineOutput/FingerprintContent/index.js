import React, { Component } from 'react';
import { number, string, arrayOf, func, shape, object } from 'prop-types';
import classNames from 'classnames';

import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';

import FingerprintEntity from '../FingerprintEntity';
import FingerprintLibraries from '../FingerprintLibraries';
import styles from './styles.scss';

export default class FingerprintContent extends Component {
  static propTypes = {
    libraries: arrayOf(
      shape({
        name: string,
        libraryId: string.isRequired,
        description: string,
        entities: arrayOf(
          shape({
            name: string,
            entityId: string.isRequired,
            metadata: object,
            profileImageUrl: string,
            matches: arrayOf(
              shape({
                startTimeMs: number,
                stopTimeMs: number,
                object: shape({
                  entityId: string,
                  confidence: number
                })
              })
            )
          })
        )
      })
    ),
    className: string,
    libraryClassName: string,
    entityClassName: string,
    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number,
    onClick: func
  };

  static defaultProps = {
    mediaPlayerTimeMs: -1,
    mediaPlayerTimeIntervalMs: 0
  };

  state = {
    showLibrary: true
  };

  handleBackButtonClick = () => {
    this.setState({
      showLibrary: true
    });
  };

  handleEntityClick = (event, value) => {
    this.setState({
      showLibrary: false,
      selectedEntity: value
    });
  };

  renderContentHeader() {
    const disclaimer = (
      <div className={classNames(styles.disclaimer)}>
        Disclaimer: Ads and songs captured are based on data provided and may
        not be visually displayed in the correct manner.
      </div>
    );

    const controlers = (
      <div className={classNames(styles.controllers)}>
        <Button
          className={classNames(styles.btnBack)}
          onClick={this.handleBackButtonClick}
        >
          <Icon className={classNames(styles.leftIcon, 'icon-arrow-back')} />
          Back
        </Button>
      </div>
    );

    return (
      <div className={classNames(styles.contentHeader)}>
        {this.state.showLibrary ? disclaimer : controlers}
      </div>
    );
  }

  renderContentBody() {
    const {
      onClick,
      libraries,
      entityClassName,
      libraryClassName,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs
    } = this.props;

    if (this.state.showLibrary || !this.state.selectedEntity) {
      return (
        <FingerprintLibraries
          libraries={libraries}
          onClick={this.handleEntityClick}
          className={classNames(libraryClassName)}
          mediaPlayerTimeMs={mediaPlayerTimeMs}
          mediaPlayerTimeIntervalMs={mediaPlayerTimeIntervalMs}
        />
      );
    } else {
      return (
        <FingerprintEntity
          entity={this.state.selectedEntity}
          onClick={onClick}
          className={classNames(entityClassName)}
          mediaPlayerTimeMs={mediaPlayerTimeMs}
          mediaPlayerTimeIntervalMs={mediaPlayerTimeIntervalMs}
        />
      );
    }
  }

  render() {
    return (
      <div
        className={classNames(styles.fingerprintContent, this.props.className)}
      >
        {this.renderContentHeader()}
        {this.renderContentBody()}
      </div>
    );
  }
}
