import React from 'react';

import {
  string,
  bool,
  arrayOf,
} from 'prop-types';

import {
  Checkbox
} from 'components/formComponents';

import styles from './styles.scss';

export default class SDOTile extends React.Component {
  static propTypes = {
    sourceName: string,
    createdAt: string,
    name: string,
    timeZone: string,
    text: string,
    profileImage: string,
    attributes: arrayOf(string)
  };

  static defaultProps = {
    sourceName: 'SDO Source',
    createdAt: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    timeZone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts and everything in between blah blah blah blah blah Your official source for Twitter posts and everything in between blah blah blah blah blah',
    profileImage: 'link',
    attributes: ['really long attribute name', '2', '3']
  };

  state = {
    flexValue: 1 / (Object.keys(this.props).length + this.props.attributes.length - 1),
    checked: false
  };

  handleCheckboxChange = () => {
    this.setState({
      checked: !this.state.checked
    });
  };

  

  render() {
    return (
      <div className={styles.sdoTile}>
        <Checkbox
          input={{
            onChange: this.handleCheckboxChange,
            value: this.state.checked
          }}
          className={styles.checkbox}
          style={{flex: this.state.flexValue}}
          label=''
        />
        <span className={styles.sdoBasicColumn} style={{flex: this.state.flexValue}}>{this.props.createdAt}</span>
        <span className={styles.sdoBasicColumn} style={{flex: this.state.flexValue}}>{this.props.name}</span>
        <span className={styles.sdoBasicColumn} style={{flex: this.state.flexValue}}>{this.props.timeZone}</span>
        <span className={styles.sdoTextColumn} style={{flex: this.state.flexValue}}>{this.props.text}</span>
        <span className={styles.sdoBasicColumn} style={{flex: this.state.flexValue}}>{this.props.profileImage}</span>
        <Attributes attributes={this.props.attributes} flexValue={this.state.flexValue}/>
      </div>
    );
  }
}

function Attributes(props) {
  const attributes = props.attributes;
  const flexValue = props.flexValue;
  return (
    attributes.map(function (attribute, index) {
          return <span className={styles.sdoBasicColumn} style={{flex: flexValue}} key={index}>{attribute}</span>
    })
  );
}