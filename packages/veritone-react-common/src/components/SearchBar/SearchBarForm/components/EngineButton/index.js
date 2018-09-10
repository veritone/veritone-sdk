import { func, string, shape } from 'prop-types';
import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';




class EngineButton extends React.Component {

  static propTypes = {
    onClick: func,
    selectedColor: string,
    color: string,
    engineCategory: shape({
      id: string,
      name: string,
      iconClass: string,
      title: string,
      subtitle: string
    })
  };

  static defaultProps = {
    color: 'grey'
  }

  handleClick() {
    this.props.onClick(this.props.engineCategory.id)
  }

  render() {

    const { engineCategory, selectedColor, color } = this.props;

    return (
      <Tooltip
        title={engineCategory.title}
        placement="bottom"
        id={engineCategory.id}
      >
        <Button  size='small' color={selectedColor} onClick={this.handleClick } style={{minWidth: '0px'}}>
          <Icon className={engineCategory.iconClass} color={color}  />
        </Button>
      </Tooltip>
    );
  }
}

export default EngineButton;
