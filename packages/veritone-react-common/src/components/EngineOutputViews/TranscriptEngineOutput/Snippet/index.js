import React, { Component } from 'react';
import { string, bool, shape, func } from 'prop-types';
import classNames from 'classnames';

import styles from './styles.scss';

class Snippet extends Component {
  static propTypes = {
    snippet: shape({
      text: string
    }),
    boldText: bool,
    editModeEnabled: bool,
    onSnippetClick: func.isRequired
  };

  handleSnippetClick = () => {
    this.props.onSnippetClick(this.props.snippet);
  }

  render() {
    let { snippet, boldText, editModeEnabled } = this.props;
    return (
      <p 
        className={classNames(styles.snippetText, boldText && styles.boldText)}
        onClick={this.handleSnippetClick}
      >{snippet.text} </p>
    );
  }
}

export default Snippet;