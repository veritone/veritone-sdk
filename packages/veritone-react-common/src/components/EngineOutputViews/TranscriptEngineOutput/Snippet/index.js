import React, { Component } from 'react';
import { string, bool, shape, func } from 'prop-types';
import classNames from 'classnames';
import { isFunction } from 'lodash';
import ContentEditable from 'react-contenteditable';

import styles from './styles.scss';


class Snippet extends Component {
  static propTypes = {
    snippet: shape({
      text: string
    }),
    boldText: bool,
    editModeEnabled: bool,
    onSnippetClick: func,
    onSnippetEdit: func
  };

  handleSnippetClick = () => {
    if (isFunction(this.props.onSnippetClick)) {
      this.props.onSnippetClick(this.props.snippet);
    }
  }

  handleSnippetChange = (evt) => {
    if (isFunction(this.props.onSnippetEdit)) {
      this.props.onSnippetEdit(this.props.snippet, evt.target.value);
    }
  }

  render() {
    let { snippet, boldText, editModeEnabled } = this.props;
    return (
      <ContentEditable
        tagName="p"
        className={classNames(styles.snippetText, boldText && styles.boldText)}
        onChange={this.handleSnippetChange}
        html={snippet.text}
        disabled={!editModeEnabled}
      />
    );
  }
}

export default Snippet;