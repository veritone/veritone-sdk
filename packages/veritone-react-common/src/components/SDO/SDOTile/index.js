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
  };

  state = {
    // flexValue: 1 / (this.props.numberOfFields + 1), //add one for the checkbox
    checked: this.props.checkAll || false
  };

  handleCheckboxChange = () => {
    this.setState({
      checked: !this.state.checked
    });
  };

  componentWillReceiveProps(nextProps) {
    this.setState({checked: nextProps.checkAll});
  };


  render() {
    const columnSections = Object.values(this.props.columns).map((column, index) => {
      return <span className={styles.sdoBasicColumn} key={index}>{column}</span>
    });
    return (
      <div className={styles.sdoTile}>
        <Checkbox
          input={{
            onChange: this.handleCheckboxChange,
            value: this.state.checked
          }}
          className={styles.checkbox}
          label=''
        />
        {columnSections}
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
  };
};