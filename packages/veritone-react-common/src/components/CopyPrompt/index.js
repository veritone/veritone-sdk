import React from 'react';
import { isString } from 'lodash';
import Clipboard from 'clipboard';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import { node, string, shape, arrayOf, oneOfType, bool, any } from 'prop-types';

import styles from './styles';

class CopyPrompt extends React.Component {
  static propTypes = {
    children: node,
    args: arrayOf(
      oneOfType([string, shape({ t: string.isRequired, color: string })])
    ),
    fullWidth: bool,
    showPrompt: bool,
    classes: shape({ any })
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
    const { classes } = this.props;
    return (
      <div
        className={classes['container']}
        style={{ width: this.props.fullWidth ? '100%' : 'auto' }}
      >
        <div
          className={classes['prompt']}
          style={{ width: this.props.fullWidth ? '100%' : 'auto' }}
        >
          {this.props.showPrompt && (
            <span className={classes['promptSymbol']}>$</span>
          )}
          <span ref={this.containerRef}>
            {this.props.children ||
              this.props.args.map(
                arg =>
                  isString(arg) ? (
                    <span key={arg}>{arg}</span>
                  ) : (
                      <span
                        className={classes[`color${arg.color || 'black'}`]}
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
              classes={{ root: classes.button }}
            >
              Copy
            </Button>
          </span>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(CopyPrompt);
