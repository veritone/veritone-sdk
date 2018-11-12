import React, { Component, Fragment } from 'react';
import { shape, func, arrayOf, string } from 'prop-types';
import { get, find, uniq } from 'lodash';
import TextField from '@material-ui/core/TextField';
import TagPill from './tagPill';
import styles from './styles.scss';

export default class TagsField extends Component {
  static propTypes = {
    input: shape({
      onChange: func.isRequired,
      value: arrayOf(
        shape({
          value: string
        })
      )
    }).isRequired,
    label: string,
    placeholder: string
  };

  state = {
    inputValue: ''
  };

  onRemoveTag = tag => {
    const {
      input: { value, onChange }
    } = this.props;
    onChange(
      value.filter(t => {
        if (t.hasOwnProperty('value')) {
          return t.value !== tag;
        } else if (Object.keys(t).length) {
          const tagKey = Object.keys(t)[0];
          return t !== `${tagKey}:${tag[tagKey]}`;
        }
        return true;
      })
    );
  };

  parseInput = evt => {
    const {
      input: { value, onChange }
    } = this.props;
    const commaSeparated = get(evt, 'target.value', '').split(',');
    onChange(
      uniq(
        value.concat(
          commaSeparated.filter(v => {
              return v.trim().length && !find(value, { value: v });
            })
            .map(v => ({ value: v.trim() }))
        )
      )
    );
    this.setState({
      inputValue: ''
    });
  };

  handleKeyPress = evt => {
    if (evt.key === 'Enter') {
      this.parseInput(evt);
      evt.preventDefault();
    }
  };

  handleInputChange = evt => {
    this.setState({
      inputValue: evt.target.value
    });
  };

  render() {
    const {
      input: { value },
      label,
      placeholder
    } = this.props;
    return (
      <TextField
        label={label}
        placeholder={placeholder}
        onBlur={this.parseInput}
        onKeyPress={this.handleKeyPress}
        value={this.state.inputValue}
        onChange={this.handleInputChange}
        InputProps={{
          autoFocus: true,
          style: {
            display: 'flex',
            flexWrap: 'wrap'
          },
          startAdornment: (
            <Fragment>
              {value.map(tag => {
                if (tag.hasOwnProperty('value')) {
                  return (
                    <TagPill
                      key={tag.value}
                      text={tag.value}
                      onRemove={this.onRemoveTag}
                    />
                  );
                } else if (Object.keys(tag).length) {
                  const tagKey = Object.keys(tag)[0];
                  return (
                    <TagPill
                      key={`${tagKey}:${tag[tagKey]}`}
                      text={`${tagKey}:${tag[tagKey]}`}
                    />
                  );
                }
              })}
            </Fragment>
          )
        }}
        inputProps={{
          className: styles.tagsInput
        }}
        InputLabelProps={{
          shrink: true,
          classes: {
            root: styles.tagsInputLabel,
            shrink: styles.shrink
          }
        }}
      />
    );
  }
}
