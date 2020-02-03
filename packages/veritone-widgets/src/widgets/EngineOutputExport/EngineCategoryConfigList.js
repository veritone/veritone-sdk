import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  arrayOf,
  bool,
  number,
  objectOf,
  shape,
  string,
  func,
  any
} from 'prop-types';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/styles';

import * as engineOutputExportModule from '../../redux/modules/engineOutputExport';
import EngineCategoryConfig from './EngineCategoryConfig';

import styles from './styles';

@withStyles(styles)
@connect(
  state => ({
    outputConfigsByCategoryId: engineOutputExportModule.outputConfigsByCategoryId(
      state
    ),
    expandedCategories: engineOutputExportModule.expandedCategories(state),
    fetchingEngineRuns: engineOutputExportModule.fetchingEngineRuns(state),
    speakerCategoryType: engineOutputExportModule.speakerCategoryType(state),
    hasSpeakerData: engineOutputExportModule.hasSpeakerData(state)
  }),
  {
    fetchEngineRuns: engineOutputExportModule.fetchEngineRuns,
    toggleConfigExpand: engineOutputExportModule.toggleConfigExpand,
    setHasSpeakerData: engineOutputExportModule.setHasSpeakerData
  },
  null,
  { forwardRef: true }
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
    toggleConfigExpand: func,
    setHasSpeakerData: func,
    hasSpeakerData: bool,
    speakerCategoryType: string,
    classes: shape({ any })
  };

  componentDidMount() {
    this.props.fetchEngineRuns(this.props.tdos);
  }

  componentDidUpdate() {
    // Detect if speaker data is available
    const { speakerCategoryType, outputConfigsByCategoryId } = this.props;
    let hasSpeakerDataBeenSet = this.props.hasSpeakerData;
    Object.keys(outputConfigsByCategoryId).forEach(categoryId => {
      const categoryEngines = outputConfigsByCategoryId[categoryId];
      categoryEngines.forEach(engine => {
        const isSpeakerCategory = engine.categoryType === speakerCategoryType;
        if (isSpeakerCategory && !hasSpeakerDataBeenSet) {
          hasSpeakerDataBeenSet = true;
          this.props.setHasSpeakerData(true);
        }
      });
    });
  }

  render() {
    const {
      fetchingEngineRuns,
      outputConfigsByCategoryId,
      expandedCategories,
      toggleConfigExpand,
      speakerCategoryType,
      classes
    } = this.props;

    // Temporary bypass of speaker category since we are planning
    // to separate it from transcription output in the future
    const modifiedOutputConfigsByCategoryId = Object.keys(
      outputConfigsByCategoryId
    ).filter(categoryId =>
      outputConfigsByCategoryId[categoryId].find(
        engine => engine.categoryType !== speakerCategoryType
      )
    );

    return (
      <div data-veritone-component="engine-category-config-list">
        {!fetchingEngineRuns ? (
          <List disablePadding>
            {modifiedOutputConfigsByCategoryId.map((key, index) => (
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
            <div className={classes.loadingConfigsContainer}>
              <CircularProgress size={50} thickness={2.5} />
            </div>
          )}
      </div>
    );
  }
}
