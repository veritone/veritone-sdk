import React from 'react';
import { func, string, node, shape, any } from 'prop-types';

import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/styles';
import Grow from '@material-ui/core/Grow';

import cx from 'classnames';

const styles = {
  underline: {
    '&::before': {
      right: '1em !important',
    },
    '&::after': {
      right: '1em !important',
    }
  }
};

class ExpandableInputField extends React.Component {
  static propTypes = {
    onSearch: func,
    value: string,
    onChange: func,
    onReset: func,
    icon: node.isRequired,
    onFocus: func,
    onBlur: func,
    classes: shape({ any }),
  };

  state = {
    expanded: false
  };

  resetSearch = evt => {
    if (this.props.onReset) {
      this.props.onReset(evt);
    }
    if (this._inputRef) {
      this._inputRef.focus();
    }
  };

  showSearchBar = evt => {
    this.setState({
      expanded: true
    });
  };

  hideSearchBar = evt => {
    if (!this.props.value || this.props.value.trim().length === 0) {
      this.setState({
        expanded: false
      });
    }
    if (this.props.onBlur) {
      this.props.onBlur(evt);
    }
  };

  onKeyPress = evt => {
    if (evt.key === 'Enter' && this.props.onSearch) {
      this.props.onSearch(evt.target.value);
    }
  };

  setInputRef = ref => {
    this._inputRef = ref;
  };

  render() {
    const { classes } = this.props;
    if (this.state.expanded) {
      return (
        <Grow in>
          <TextField
            value={this.props.value}
            autoFocus
            inputProps={{
              onBlur: this.hideSearchBar
            }}
            inputRef={this.setInputRef}
            onKeyPress={this.onKeyPress}
            onChange={this.props.onChange}
            onFocus={this.props.onFocus}
            InputProps={{
              classes: {
                underline: cx(classes['underline'])
              },
              endAdornment: (
                <IconButton onClick={this.resetSearch} disableRipple>
                  <CloseIcon />
                </IconButton>
              )
            }}
          />
        </Grow>
      );
    } else {
      return (
        <IconButton onClick={this.showSearchBar}>{this.props.icon}</IconButton>
      );
    }
  }
}

export default withStyles(styles)(ExpandableInputField);
