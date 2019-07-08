import React, { Fragment } from 'react';
import cx from 'classnames';
import { bool, func, arrayOf, any, string } from 'prop-types';
import {
  IconButton,
  Paper,
  Divider,
  CircularProgress,
  Zoom,
  ClickAwayListener,
  Input,
  MenuItem
} from '@material-ui/core';
import { Search, Clear } from '@material-ui/icons';

import styles from './styles.scss';

// eslint-disable-next-line
const Div = ({ className, children }) => (
  <div className={className}>{children}</div>
);

export class SimpleSearchBarBase extends React.Component {
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
    this.props.onChange(event.target.value);
  };

  clear = () => {
    this.props.onChange('');
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
        isLoading
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

    return (
      // render key added to force render during cleanup
      <ClickAwayListener onClickAway={clickAway} key={renderKey}>
        <PaperOrDiv
          style={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8
          }}
          className={cx(styles.colorContainer)}
        >
          <div className={styles.searchBarContainer}>
            <IconButton disabled={!focused} onClick={onSubmit}>
              <Search className={styles.iconColor} />
            </IconButton>
            <Input
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
              className={cx(styles.input)}
            />
            <Zoom in={!!(focused && showClear && isLoading)}>
              <div className={cx(styles.loadingIcon)}>
                <CircularProgress size={20} />
              </div>
            </Zoom>
            <Zoom in={showClear} className={cx(styles.clearButton)}>
              <IconButton onClick={this.clear}>
                <Clear />
              </IconButton>
            </Zoom>
          </div>
          {showExtension && (
            <Fragment>
              <Divider />
              <div style={{ overflow: 'scroll' }}>
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
                                  key={data.id}
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
      </ClickAwayListener>
    );
  }
}

SimpleSearchBarBase.propTypes = {
  autocomplete: bool,
  onChange: func,
  onSubmit: func,
  value: string,
  isLoading: bool,
  placeholder: string,
  autocompleteResults: arrayOf(any),
  resetOnClickAway: bool
};
