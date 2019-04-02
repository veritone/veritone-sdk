import React, { Component } from 'react';
import { arrayOf, shape, number, string, func, node } from 'prop-types';
import classNames from 'classnames';
import { sortBy, get, debounce } from 'lodash';

import { AutoSizer, List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LocalCode from 'locale-code';

import EngineOutputHeader from '../EngineOutputHeader';
import TranslationSegment from './TranslationSegment';

import styles from './styles.scss';

const cellCache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true
});

export default class TranslationEngineOutput extends Component {
  static propTypes = {
    title: string,
    data: arrayOf(
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
    onTranslateClicked: func,
    onEngineChange: func.isRequired,
    onExpandClick: func,
    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number,
    outputNullState: node
  };

  static defaultProps = {
    data: [],
    title: 'Translation',
    mediaPlayerTimeMs: -1,
    mediaPlayerTimeIntervalMs: 1000
  };

  state = {};

  static getDerivedStateFromProps(props, state) {
    const { data, defaultLanguage } = props;

    const translatedLanguages = [];
    data.forEach(dataChunk => {
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

    let translatedLanguagesInfo = translatedLanguages.map(languageCode => {
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

      return { language: languageCode, name: languageName };
    });
    translatedLanguagesInfo = sortBy(translatedLanguagesInfo, 'language');

    const selectedLanguage = !translatedLanguages.includes(state.selectedLanguage)
      ? translatedLanguages[0]
      : state.selectedLanguage || defaultLanguage;

    return {
      ...state,
      languages: translatedLanguagesInfo,
      selectedLanguage: selectedLanguage
    };
  }

  componentDidMount() {
    if (this.virtualList) {
      this.virtualList.forceUpdateGrid();
    }
    // Create resize watchers to calculate width available for text
    window.addEventListener('resize', this.onWindowResize);
    setTimeout(this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  seriesPerPage = 20;
  windowResizeDelay = 100;
  
  onWindowResize = debounce(
    () => this.handleWindowResize(),
    this.windowResizeDelay
  );

  handleWindowResize = () => {
    if (this.virtualList) {
      cellCache.clearAll();
      this.virtualList.forceUpdateGrid();
    }
  }

  virtualMeasure = (measure, index) => () => {
    measure && measure();
    if (this.virtualList) {
      this.virtualList.forceUpdateGrid();
    }
  }

  generateVirtualizedTranslationBlocks = () => {
    const {
      data
    } = this.props;
    const {
      selectedLanguage
    } = this.state;
    const totalTranslateSeries = data.reduce((acc, seg) => acc.concat(seg.series), []);
    const newVirtualizedSerieBlocks = [];

    for (let index = 0, curSeries = []; index < totalTranslateSeries.length; index++) {
      const serie = totalTranslateSeries[index];
      if (
        serie &&
        serie.words &&
        serie.language === selectedLanguage &&
        curSeries.length < this.seriesPerPage
      ) {
        curSeries.push(serie);
      }
      if (curSeries.length === this.seriesPerPage || index === totalTranslateSeries.length - 1) {
        newVirtualizedSerieBlocks.push({ series: curSeries });
        curSeries = [];
      }
    }
    return newVirtualizedSerieBlocks;
  };

  translateRowRenderer = ({ key, parent, index, style }) => {
    const {
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs,
      onTranslateClicked
    } = this.props;
    const virtualizedSerieBlocks = this.generateVirtualizedTranslationBlocks();
    const virtualizedSerieBlock = virtualizedSerieBlocks[index];

    const stopMediaPlayHeadMs = mediaPlayerTimeMs + mediaPlayerTimeIntervalMs;

    return (
      <CellMeasurer
        key={key}
        parent={parent}
        cache={cellCache}
        columnIndex={0}
        style={{ width: '100%' }}
        rowIndex={index}>
        {({ measure }) => (
          <div className={`ocr-segment-block-${index}`} style={{ ...style, width: '100%' }}>
            <TranslationSegment
              virtualMeasure={this.virtualMeasure(measure, index)}
              series={virtualizedSerieBlock.series}
              onTranslateClicked={onTranslateClicked}
              startMediaPlayHeadMs={mediaPlayerTimeMs}
              stopMediaPlayHeadMs={stopMediaPlayHeadMs}
            />
          </div>
        )}
      </CellMeasurer>
    );
  }

  handleLanguageChanged = event => {
    const selectedVal = event.target.value;
    this.setState({ selectedLanguage: selectedVal }, () => {
      if (this.virtualList) {
        cellCache.clearAll();
        this.virtualList.forceUpdateGrid();
      }
    });
  };

  render() {
    const {
      title,
      engines,
      selectedEngineId,
      onEngineChange,
      onExpandClick,
      outputNullState
    } = this.props;
    const {
      languages,
      selectedLanguage
    } = this.state;
    const virtualizedSerieBlocks = this.generateVirtualizedTranslationBlocks();

    return (
      <div
        className={classNames(styles.translationOutput, this.props.className)}
      >
        <EngineOutputHeader
          title={title}
          engines={engines}
          selectedEngineId={selectedEngineId}
          onEngineChange={onEngineChange}
          onExpandClick={onExpandClick}
        >
          {get(this.state, 'languages.length', 0) > 0 && (
            <Select
              autoWidth
              value={selectedLanguage}
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
              {languages.map(languageInfo => {
                return (
                  <MenuItem
                    value={languageInfo.language}
                    className={classNames(styles.language)}
                    key={`language-${languageInfo.language}`}
                  >
                    {languageInfo.name || languageInfo.language}
                  </MenuItem>
                );
              })}
            </Select>
          )}
        </EngineOutputHeader>
        {
          outputNullState || (
            <div
              className={classNames(styles.body)}
              data-veritone-component="translate-engine-output-content"
            >
              <AutoSizer style={{ width: '100%', height: '100%' }}>
                {({ height, width }) => (
                  <List
                    // eslint-disable-next-line
                    ref={ref => this.virtualList = ref}
                    className={'virtual-translate-list'}
                    key={`virtual-translate-grid`}
                    width={width || 900}
                    height={height || 500}
                    style={{ width: '100%', height: '100%' }}
                    deferredMeasurementCache={cellCache}
                    overscanRowCount={1}
                    rowRenderer={this.translateRowRenderer}
                    rowCount={virtualizedSerieBlocks.length}
                    rowHeight={cellCache.rowHeight}
                  />
                )}
              </AutoSizer>
            </div>
          )
        }
      </div>
    );
  }
}
