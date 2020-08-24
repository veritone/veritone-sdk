import React, { Fragment } from 'react';
import cx from 'classnames';
import {
  bool,
  func,
  arrayOf,
  any,
  string,
  shape,
  element,
  number,
  oneOfType
} from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Zoom from '@material-ui/core/Zoom';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import { Search, Clear } from '@material-ui/icons';
import { isNumber } from 'lodash';
import { withStyles } from '@material-ui/styles';

import styles from './styles';

// eslint-disable-next-line
const Div = ({ className, children }) => (
  <div className={className}>{children}</div>
);
class SimpleSearchBarBaseComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    renderKey: 101,
    isLoading: true,
    focused: false
  };

  clickAway = () => {
    if (this.props.resetOnClickAway) {
      this.props.onChange('');
      this.setState({
        focused: false,
        renderKey: Math.random()
      });
    } else {
      this.setState({
        focused: false
      });
    }
  };

  onFocus = () => {
    this.setState({ focused: true });
  };

  onChange = event => {
    const newVal = event.target.value;
    if (newVal !== this.props.value && this.props.onChange) {
      this.props.onChange(newVal);
    }
  };

  clear = () => {
    this.props.onChange && this.props.onChange('');
    this.props.onClear && this.props.onClear('');
    this.setState({
      value: '',
      focused: false,
      renderKey: Math.random()
    });
  };

  onKeyDown = key => {
    // handle esc
    if (this.state.focused && key.keyCode === 27) {
      this.clear();
    }
    // handle enter
    else if (key.keyCode === 13) {
      this.props.onSubmit();
    }
  };

  render() {
    const {
      clickAway,
      onKeyDown,
      clear,
      state: { focused, renderKey },
      props: {
        onSubmit,
        value,
        autocompleteResults,
        placeholder,
        autocomplete,
        isLoading,
        marginTop,
        width,
        classes,
      }
    } = this;

    const PaperOrDiv = focused ? Paper : Div;
    const showClear = !!value;
    const showExtension = !!(
      autocomplete &&
      autocompleteResults &&
      autocompleteResults.length &&
      value &&
      focused
    );

    let _width;
    if (!width && !isNumber(width)) {
      _width = '512px'
    } else if (isNumber(width)) {
      _width = width + 'px'
    } else {
      _width = width;
    }

    return (
      // render key added to force render during cleanup
      <ClickAwayListener onClickAway={clickAway} key={renderKey}>
        {/*this div here to prevent click away firing immediately, probably bug of material-ui*/}
        <div style={{ marginTop }} className={classes.wrapper}>
          <PaperOrDiv
            style={{
              borderRadius: 8
            }}
            className={cx({
              [classes.colorContainer]: true,
              [classes.focusedColor]: focused
            })}
          >
            <div data-test="simpleSearchBarContainer" className={classes.searchBarContainer} style={{ width: _width }}>
              <IconButton data-test="simpleSearchBarIcon" disabled={!focused} onClick={onSubmit}>
                <Search className={classes.iconColor} />
              </IconButton>
              <Input
                data-test="simpleSearchBarInput"
                // handle esc and enter
                onKeyDown={onKeyDown}
                // disable browser auto complete
                autoComplete="false"
                // remove material's underline
                disableUnderline
                placeholder={placeholder || 'Search'}
                autoFocus={focused}
                value={value}
                onChange={this.onChange}
                onFocus={this.onFocus}
                className={cx(classes.input)}
                key={renderKey + 1}
              />
              <Zoom in={!!(focused && showClear && isLoading)}>
                <div data-test="simpleSearchBarLoadingIcon" className={cx(classes.loadingIcon)}>
                  <CircularProgress size={20} />
                </div>
              </Zoom>
              <Zoom in={showClear} className={cx(classes.clearButton)}>
                <IconButton data-test="simpleSearchBarClearIcon" onClick={this.clear}>
                  <Clear />
                </IconButton>
              </Zoom>
            </div>
            {showExtension && (
              <Fragment>
                <Divider />
                <div style={{ overflow: 'scroll', background: 'white' }}>
                  {autocompleteResults.map(result => {
                    // if we have plain string array
                    // eslint-disable-next-line lodash/prefer-lodash-typecheck
                    if (typeof result === 'string') {
                      return (
                        <MenuItem
                          key={result}
                          // eslint-disable-next-line react/jsx-no-bind
                          onClick={() => clear() || result.onClick(result)}
                        >
                          {result}
                        </MenuItem>
                      );
                    }
                    // if we have data groups
                    else {
                      if (result.data && result.data.length) {
                        // get the template
                        let TemplateComponent = result.template;
                        return (
                          <Fragment key={Math.random()}>
                            {// map data to template
                              result.data.map(data => {
                                // eslint-disable-next-line lodash/prefer-lodash-typecheck
                                if (typeof data === 'string') {
                                  return (
                                    <MenuItem
                                      key={data}
                                      // eslint-disable-next-line react/jsx-no-bind
                                      onClick={() =>
                                        clear() || result.onClick(data)
                                      }
                                    >
                                      {TemplateComponent(data)}
                                    </MenuItem>
                                  );
                                } else {
                                  return (
                                    <MenuItem
                                      key={data.id || data.key}
                                      // eslint-disable-next-line react/jsx-no-bind
                                      onClick={() =>
                                        clear() || result.onClick(data)
                                      }
                                    >
                                      <TemplateComponent {...data} />
                                    </MenuItem>
                                  );
                                }
                              })}
                            <Divider />
                          </Fragment>
                        );
                      }
                    }
                  })}
                </div>
              </Fragment>
            )}
          </PaperOrDiv>
        </div>
      </ClickAwayListener>
    );
  }
}

SimpleSearchBarBaseComponent.propTypes = {
  autocomplete: bool,
  onChange: func,
  onSubmit: func,
  onClear: func,
  value: string,
  isLoading: bool,
  placeholder: string,
  autocompleteResults: arrayOf(
    shape({
      template: oneOfType([element, func]),
      // literally array of any
      data: arrayOf(any),
      onClick: func
    })
  ),
  resetOnClickAway: bool,
  marginTop: string,
  width: oneOfType([string, number]),
  classes: shape({ any }),
};

const SimpleSearchBarBase = withStyles(styles)(SimpleSearchBarBaseComponent);

export {
  SimpleSearchBarBase
};
