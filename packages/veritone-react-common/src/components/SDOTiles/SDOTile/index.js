import React from 'react';

import {
  string,
  bool,
  func,
  arrayOf,
  number
} from 'prop-types';

import styles from './styles.scss';

import {
  Checkbox
} from 'components/formComponents';

import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'
const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis)


export default class SDOTile extends React.Component {
  static propTypes = {
    checkAll: bool,
    createdAt: string,
    name: string,
    timeZone: string,
    text: string,
    profileImage: string,
    attributes: arrayOf(string),
    numberOfFields: number
  };

  static defaultProps = {
    checkAll: false,
    createdAt: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    timeZone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profileImage: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    attributes: ['really long attribute name', 'description', 'description'],
    numberOfFields: 9
  };

  state = {
    flexValue: 1 / this.props.numberOfFields,
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
        {/* <ResponsiveEllipsis
          className={styles.sdoTextColumn} 
          style={{flex: this.state.flexValue}}
          text={this.props.text}
          maxLine='3'
          ellipsis='...'
          trimRight
          basedOn='letters'
          component='span'
        /> */}
        <img className={styles.sdoProfileImage} style={{flex: this.state.flexValue}} src={this.props.profileImage}></img>
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