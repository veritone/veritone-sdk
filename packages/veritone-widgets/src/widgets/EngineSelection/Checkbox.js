import React from 'react';
import { Checkbox } from 'material-ui';
// import UnCheckedIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
// import CheckedIcon from 'material-ui/svg-icons/toggle/check-box'
import SvgIcon from 'material-ui/SvgIcon';

export default class HelloWorld extends React.Component {
  constructor(props) {
  super(props);
}

render() {

  const CheckedIcon = props => (
    <SvgIcon style={{fill: "#ffffff", color: "#000"}}>
      <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </SvgIcon>
  );

  const UnCheckedIcon = props => (
    <SvgIcon style={{ backgroundColor: "#ffffff" }}>
      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
    </SvgIcon>
  );

  return (
    <div style={{ border: '1px solid black', backgroundColor: 'black'}}>
      <Checkbox 
        uncheckedIcon={<UnCheckedIcon />}
        checkedIcon={<CheckedIcon />}
        label="Checkbox Label"
      />
    </div>
  )}
}