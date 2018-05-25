import React, { Component } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import classNames from 'classnames';
import { sortBy } from 'lodash';

import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import LocalCode from 'locale-code';

import EngineOutputHeader from '../EngineOutputHeader';
import TranslationContent from './TranslationContent';

import styles from './styles.scss';

export default class TranslationEngineOutput extends Component {
  static propTypes = {
    title: string,
    contents: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        status: string,
        series: arrayOf(
          shape({
            startTimeMs: number,
            stopTimeMs: number,
            status: string,
            language: string.isRequired,
            words: arrayOf(
              shape({
                word: string,
                confidence: number
              })
            )
          })
        )
      })
    ),

    engines: arrayOf(
      shape({
        id: string,
        name: string
      })
    ).isRequired,
    selectedEngineId: string.isRequired,

    defaultLanguage: string,

    className: string,
    headerClassName: string,
    bodyClassName: string,
    contentClassName: string,

    onClick: func,
    onScroll: func,
    onRerunProcess: func.isRequired,
    onEngineChange: func.isRequired,
    onExpandClicked: func,
    onLanguageChanged: func,

    mediaLengthMs: number,
    neglectableTimeMs: number,
    estimatedDisplayTimeMs: number,

    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number
  };

  static defaultProps = {
    contents: [],
    title: 'Translation',
    neglectableTimeMs: 500,
    mediaPlayerTimeMs: -1,
    mediaPlayerTimeIntervalMs: 1000
  };

  setLanguageOptions() {
    const { contents, defaultLanguage } = this.props;

    const translatedLanguages = [];
    contents.forEach(dataChunk => {
      const series = dataChunk.series;
      if (series) {
        series.forEach(entry => {
          const entryLanguage = entry.language;
          !translatedLanguages.includes(entryLanguage) &&
            translatedLanguages.push(entryLanguage);
        });
      }
    });
    translatedLanguages.sort();

    let translatedLanguagesInfo = [];
    translatedLanguages.forEach(languageCode => {
      let languageName;
      if (languageCode.length === 2) {
        languageName = LocalCode.getLanguageName(languageCode + '-XX');
        if (!languageName || languageName.length === 0) {
          languageName = languageCode;
        }
      } else {
        languageName = LocalCode.getLanguageName(languageCode);
        if (languageName && languageName.length > 0) {
          const countryCode = LocalCode.getCountryCode(languageCode);
          if (countryCode && countryCode.length > 0) {
            languageName = languageName + ' (' + countryCode + ')';
          }
        } else {
          languageName = languageCode;
        }
      }

      translatedLanguagesInfo.push({
        language: languageCode,
        name: languageName
      });
    });
    translatedLanguagesInfo = sortBy(translatedLanguagesInfo, 'language');

    this.setState(prevState => {
      const selectedLanguage =
        (prevState && prevState.selectedLanguage) ||
        defaultLanguage ||
        translatedLanguages[0];

      return {
        languages: translatedLanguagesInfo,
        selectedLanguage: selectedLanguage
      };
    });
  }

  getSelectedContent() {
    const selectedLanguage = this.state.selectedLanguage;
    const selectedContent = [];
    this.props.contents.forEach(chunk => {
      if (!chunk.series) {
        selectedContent.push(chunk); // Error chunks that doesn't have series
      } else {
        const filteredSeries = chunk.series.filter(entry => {
          return entry.language === selectedLanguage && entry;
        });
        selectedContent.push({
          startTimeMs: chunk.startTimeMs,
          stopTimeMs: chunk.stopTimeMs,
          series: filteredSeries
        });
      }
    });

    return selectedContent;
  }

  UNSAFE_componentWillMount() {
    this.setLanguageOptions();
  }

  handleLanguageChanged = event => {
    const selectedVal = event.target.value;
    this.setState({ selectedLanguage: selectedVal });
    this.props.onLanguageChanged && this.props.onLanguageChanged(selectedVal);
  };

  renderHeader() {
    const {
      title,
      engines,
      selectedEngineId,
      onEngineChange,
      onExpandClicked,
      headerClassName
    } = this.props;

    return (
      <EngineOutputHeader
        title={title}
        engines={engines}
        selectedEngineId={selectedEngineId}
        onEngineChange={onEngineChange}
        onExpandClicked={onExpandClicked}
        className={classNames(headerClassName)}
      >
        <Select
          autoWidth
          value={this.state.selectedLanguage}
          onChange={this.handleLanguageChanged}
          className={classNames(styles.languages)}
          MenuProps={{
            anchorOrigin: {
              horizontal: 'center',
              vertical: 'bottom'
            },
            transformOrigin: {
              horizontal: 'center'
            },
            getContentAnchorEl: null
          }}
        >
          {this.state.languages.map(languageInfo => {
            return (
              <MenuItem
                value={languageInfo.language}
                className={classNames(styles.language)}
                key={'language-' + languageInfo.language}
              >
                {languageInfo.name || languageInfo.language}
              </MenuItem>
            );
          })}
        </Select>
      </EngineOutputHeader>
    );
  }

  renderBody() {
    const {
      bodyClassName,
      contentClassName,

      onClick,
      onScroll,
      onRerunProcess,

      mediaLengthMs,
      neglectableTimeMs,
      estimatedDisplayTimeMs,

      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs
    } = this.props;

    const selectedContents = this.getSelectedContent();

    return (
      <div className={classNames(styles.body, bodyClassName)}>
        <TranslationContent
          contents={selectedContents}
          className={contentClassName}
          onClick={onClick}
          onScroll={onScroll}
          onRerunProcess={onRerunProcess}
          mediaLengthMs={mediaLengthMs}
          neglectableTimeMs={neglectableTimeMs}
          estimatedDisplayTimeMs={estimatedDisplayTimeMs}
          mediaPlayerTimeMs={mediaPlayerTimeMs}
          mediaPlayerTimeIntervalMs={mediaPlayerTimeIntervalMs}
        />
      </div>
    );
  }

  render() {
    return (
      <div
        className={classNames(styles.translationOutput, this.props.className)}
      >
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    );
  }
}
