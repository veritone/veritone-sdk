import React from 'react';

import {
  string,
  bool,
  func,
  arrayOf,
  number,
  objectOf,
  any
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
    columns: objectOf(any),
    checkAll: bool,
    numberOfFields: number
  };

  static defaultProps = {
    checkAll: false
    // columns: {
    //   createdAt: 'Sat Dec 14 04:35:55 +0000 2013',
    //   name: 'TwitterDev',
    //   timeZone: 'Pacific Time (US & Canada)',
    //   text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    //   profileImage: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    //   attributes: ['really long attribute name', 'description', 'description']
    // },
    // numberOfFields: 8
  };

  state = {
    flexValue: 1 / (this.props.numberOfFields + 1), //add one for the checkbox
    checked: this.props.checkAll || false
  };

  handleCheckboxChange = () => {
    this.setState({
      checked: !this.state.checked
    });
  };


  render() {
    const columnSections = Object.values(this.props.columns).map((column, index) => {
      console.log(column);
      if (column.indexOf('image') !== -1) { //TODO: this won't always work, need a way to know if a field is an image
        // change tag for images
        return <img className={styles.sdoProfileImage} style={{flex: this.state.flexValue}} src={column} key={index}></img>
      } else {
        return <span className={styles.sdoBasicColumn} style={{flex: this.state.flexValue}} key={index}>{column}</span>
      }
    });
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
        {columnSections}
        {/* <span className={styles.sdoBasicColumn} style={{flex: this.state.flexValue}}>{this.props.columns.createdAt}</span>
        <span className={styles.sdoBasicColumn} style={{flex: this.state.flexValue}}>{this.props.columns.name}</span>
        <span className={styles.sdoBasicColumn} style={{flex: this.state.flexValue}}>{this.props.columns.timeZone}</span>
        <span className={styles.sdoTextColumn} style={{flex: this.state.flexValue}}>{this.props.columns.text}</span> */}
        {/* <ResponsiveEllipsis
          className={styles.sdoTextColumn} 
          style={{flex: this.state.flexValue}}
          text={this.props.columns.text}
          maxLine='3'
          ellipsis='...'
          trimRight
          basedOn='letters'
          component='span'
        /> */}
        {/* <img className={styles.sdoProfileImage} style={{flex: this.state.flexValue}} src={this.props.columns.profileImage}></img> */}
        {/* <Attributes attributes={this.props.columns.attributes} flexValue={this.state.flexValue}/> */}
      </div>
    );
  }
}

// function Attributes(props) {
//   const attributes = props.attributes;
//   const flexValue = props.flexValue;
//   return (
//     attributes.map(function (attribute, index) {
//       return <span className={styles.sdoBasicColumn} style={{flex: flexValue}} key={index}>{attribute}</span>
//     })
//   );
// }