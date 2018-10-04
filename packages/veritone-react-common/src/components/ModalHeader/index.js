import React from 'react';
import { arrayOf, string, element, node, bool, func } from 'prop-types';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import grey from '@material-ui/core/colors/grey';
import { noop } from 'lodash';

import styles from './styles.scss';

export default class ModalHeader extends React.Component {
  static propTypes = {
    children: node,
    title: string,
    icons: arrayOf(element),
    backgroundColor: string,
    color: string,
    height: string,
    closeButton: bool,
    onClose: func
  };

  static defaultProps = {
    backgroundColor: '#1f2532',
    color: grey[50],
    height: '65px',
    icons: [],
    onClose: noop
  };

  render() {
    const hasIcons = !!this.props.icons.length;

    return (
      <div
        className="modal-header"
        style={{
          backgroundColor: this.props.backgroundColor,
          color: this.props.color
        }}
      >
        <div
          className={styles.fullScreenTopBar}
          style={{ height: this.props.height }}
        >
          {this.props.title && (
            <span className={styles.topBarTitle}>{this.props.title}</span>
          )}
          {(hasIcons || this.props.closeButton) && (
            <div className={styles.iconGroup}>
              {hasIcons && this.props.icons}
              {hasIcons &&
                this.props.closeButton && <span className={styles.separator} />}
              {this.props.closeButton && (
                <IconButton aria-label="exit" color="inherit" disableRipple>
                  <Icon
                    className="icon-close-exit"
                    onClick={this.props.onClose}
                  />
                </IconButton>
              )}
            </div>
          )}
        </div>
        {this.props.children && <div>{this.props.children}</div>}
      </div>
    );
  }
}
