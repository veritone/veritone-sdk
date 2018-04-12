import React, { Component } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import classNames from 'classnames';

import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

import EngineOutputHeader from '../EngineOutputHeader';
import TranslationContent from './TranslationContent';
import styles from './styles.scss';

export default class TranslationEngineOutput extends Component {
  static propTypes = {
    title: string,
    contents: arrayOf(shape({
      startTimeMs: number,
      stopTimeMs: number,
      series: arrayOf(shape({
        startTimeMs: number,
        stopTimeMs: number,
        status: string,
        words: arrayOf(shape({
          word: string,
          confidence: number
        }))
      }))
    })),

    engines: arrayOf(
      shape({
        id: string,
        name: string
      })
    ),
    selectedEngineId: string,

    languages: arrayOf(
      shape({
        id: string,
        name: string
      })
    ),
    selectedLanguageId: string,

    className: string,
    headerClassName: string,
    bodyClassName: string,
    contentClassName: string,

    onClick: func,
    onScroll: func,
    onRerunProcess: func,
    onEngineChange: func,
    onExpandClicked: func,
    onLanguageChanged: func,

    mediaLengthMs: number,
    neglectableTimeMs: number,
    estimatedDisplayTimeMs: number,

    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number
  }

  static defaultProps = {
    contents: [],
    title: 'Translation',
    neglectableTimeMs: 500,
    mediaPlayerTimeMs: -1,
    mediaPlayerTimeIntervalMs: 1000
  };

  handleLanguageChanged = (event) => {
    (this.props.onLanguageChanged) && this.props.onLanguageChanged(event.target.value);
  } 

  renderHeader () {
    let {
      title,
      engines,
      selectedEngineId,
      onEngineChange,
      onExpandClicked,

      headerClassName,
      
      languages,
      selectedLanguageId,
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
          value={selectedLanguageId}
          onChange={this.handleLanguageChanged}
          className={classNames(styles.languages)}
        >
          {
            languages.map(language => {
              return <MenuItem value={language.id} key={'language-' + language.id}>{language.name}</MenuItem>
            })
          }
        </Select>
      </EngineOutputHeader>
    );
  }


  renderBody () {
    let {
      contents,
      bodyClassName,
      contentClassName,

      onClick,
      onScroll,
      onRerunProcess,

      mediaLengthMs,
      neglectableTimeMs,
      estimatedDisplayTimeMs,

      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs,
    } = this.props;

    return (
      <div className={classNames(styles.body, bodyClassName)}>
        <TranslationContent 
          contents={contents}
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


  render () {
    return (
      <div className={classNames(styles.translationOutput, this.props.className)}>
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    );
  }
}