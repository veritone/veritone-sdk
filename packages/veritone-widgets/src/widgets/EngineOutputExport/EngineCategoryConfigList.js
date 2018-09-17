import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  arrayOf,
  bool,
  number,
  objectOf,
  shape,
  string,
  func
} from 'prop-types';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

import * as engineOutputExportModule from '../../redux/modules/engineOutputExport';
import EngineCategoryConfig from './EngineCategoryConfig';

import styles from './styles.scss';

@connect(
  state => ({
    outputConfigsByCategoryId: engineOutputExportModule.outputConfigsByCategoryId(
      state
    ),
    expandedCategories: engineOutputExportModule.expandedCategories(state),
    fetchingEngineRuns: engineOutputExportModule.fetchingEngineRuns(state)
  }),
  {
    fetchEngineRuns: engineOutputExportModule.fetchEngineRuns,
    toggleConfigExpand: engineOutputExportModule.toggleConfigExpand
  },
  null,
  { withRef: true }
)
export default class EngineCategoryConfigList extends Component {
  static propTypes = {
    tdos: arrayOf(
      shape({
        tdoId: string.isRequired,
        mentionId: string,
        startOffsetMs: number,
        stopOffsetMs: number
      })
    ).isRequired,
    outputConfigsByCategoryId: objectOf(
      arrayOf(
        shape({
          engineId: string,
          categoryId: string
        })
      )
    ).isRequired,
    expandedCategories: objectOf(bool),
    fetchEngineRuns: func,
    fetchingEngineRuns: bool,
    toggleConfigExpand: func
  };

  componentDidMount() {
    this.props.fetchEngineRuns(this.props.tdos);
  }

  render() {
    const {
      fetchingEngineRuns,
      outputConfigsByCategoryId,
      expandedCategories,
      toggleConfigExpand
    } = this.props;

    return (
      <div data-veritone-element="engine-category-config-list">
        {!fetchingEngineRuns ? (
          <List disablePadding>
            {Object.keys(outputConfigsByCategoryId).map((key, index) => (
              <Fragment key={`engine-output-config-${key}`}>
                <EngineCategoryConfig
                  categoryId={key}
                  engineCategoryConfigs={outputConfigsByCategoryId[key]}
                  expanded={expandedCategories[key]}
                  onExpandConfigs={toggleConfigExpand}
                />
                {index !==
                  Object.keys(outputConfigsByCategoryId).length - 1 && (
                  <Divider />
                )}
              </Fragment>
            ))}
          </List>
        ) : (
          <div className={styles.loadingConfigsContainer}>
            <CircularProgress size={50} thickness={2.5} />
          </div>
        )}
      </div>
    );
  }
}
