import React from 'react';
import { isString } from 'lodash';
import Clipboard from 'clipboard';
import Button from '@material-ui/core/Button';
import { node, string, shape, arrayOf, oneOfType, bool } from 'prop-types';

import styles from './styles.scss';

export default class CopyPrompt extends React.Component {
  static propTypes = {
    children: node,
    args: arrayOf(
      oneOfType([string, shape({ t: string.isRequired, color: string })])
    ),
    fullWidth: bool,
    showPrompt: bool
  };

  static defaultProps = {
    fullWidth: false,
    showPrompt: true
  };

  // eslint-disable-next-line
  containerRef = React.createRef();
  triggerRef = React.createRef();

  componentDidMount() {
    this.clipboard = new Clipboard(this.triggerRef.current, {
      text: () => this.containerRef.current.innerText
    });
  }

  componentWillUnmount() {
    this.clipboard.destroy();
  }

  render() {
    return (
      <div
        className={styles['container']}
        style={{ width: this.props.fullWidth ? '100%' : 'auto' }}
      >
        <div
          className={styles['prompt']}
          style={{ width: this.props.fullWidth ? '100%' : 'auto' }}
        >
          {this.props.showPrompt && (
            <span className={styles['prompt-symbol']}>$</span>
          )}
          <span ref={this.containerRef}>
            {this.props.children ||
              this.props.args.map(
                arg =>
                  isString(arg) ? (
                    <span key={arg}>{arg}</span>
                  ) : (
                    <span
                      className={styles[`color--${arg.color || 'black'}`]}
                      key={arg.t}
                    >
                      {arg.t}
                    </span>
                  )
              )}
          </span>
        </div>
        {Clipboard.isSupported() && (
          <span ref={this.triggerRef}>
            <Button
              variant="contained"
              color="primary"
              classes={{ root: styles.button }}
            >
              Copy
            </Button>
          </span>
        )}
      </div>
    );
  }
}
