import React, { Component } from 'react';
import { number, string, arrayOf, func, shape } from 'prop-types';
import classNames from 'classnames';

import Icon from '@material-ui/core/Icon';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import EntityMetadata from './EntityMetadata';
import EntityStreamData from './EntityStreamData';
import styles from './styles.scss';

@withMuiThemeProvider
export default class FingerprintEntity extends Component {
  static propTypes = {
    className: string,
    entity: shape({
      id: string.isRequired,
      name: string.isRequired,
      profileImageUrl: string,
      description: string,
      libraryId: string,
      libraryName: string,
      jsondata: shape({}),
      matches: arrayOf(
        shape({
          startTimeMs: number.isRequired,
          stopTimeMs: number.isRequired,
          object: shape({
            entityId: string.isRequired,
            confidenced: number
          })
        })
      )
    }),
    onClick: func,
    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number
  };

  state = {
    tabIndex: 0
  };

  handleChangeTab = (event, value) => {
    this.setState({
      tabIndex: value
    });
  };

  renderEntityInfo() {
    const entity = this.props.entity;
    const entityInfoString = entity.name + ' (' + entity.matches.length + ')';
    return (
      <div className={classNames(styles.entityInfo)}>
        <div className={classNames(styles.logo)}>
          <img src={entity.profileImageUrl || '//static.veritone.com/veritone-ui/default-nullstate.svg'} />
        </div>
        <div>
          <div className={classNames(styles.entityName)}>
            {entityInfoString}
          </div>
          <div className={classNames(styles.libraryName)}>
            <Icon className={classNames('icon-library-app', styles.icon)} />
            <span className={classNames(styles.libraryText)}> Library: </span>
            <span className={classNames(styles.libraryText, styles.bold)}>
              {entity.libraryName || entity.libraryId}
            </span>
          </div>
        </div>
      </div>
    );
  }

  renderMatchesTime() {
    const {
      entity,
      onClick,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs
    } = this.props;

    return (
      <EntityStreamData
        data={entity.matches}
        onClick={onClick}
        mediaPlayerTimeMs={mediaPlayerTimeMs}
        mediaPlayerTimeIntervalMs={mediaPlayerTimeIntervalMs}
      />
    );
  }

  renderMetadata() {
    return <EntityMetadata jsondata={this.props.entity.jsondata} />;
  }

  renderDetails() {
    return (
      <div>
        <Tabs
          value={this.state.tabIndex}
          onChange={this.handleChangeTab}
          indicatorColor="primary"
        >
          <Tab
            label="Matched in this Video"
            className={classNames(styles.tab)}
          />
          <Tab label="Metadata" className={classNames(styles.tab)} />
        </Tabs>
        <div className={classNames(styles.detailBody)}>
          {this.state.tabIndex === 0
            ? this.renderMatchesTime()
            : this.renderMetadata()}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div
        className={classNames(styles.fingerprintEntity, this.props.className)}
      >
        {this.renderEntityInfo()}
        {this.renderDetails()}
      </div>
    );
  }
}
