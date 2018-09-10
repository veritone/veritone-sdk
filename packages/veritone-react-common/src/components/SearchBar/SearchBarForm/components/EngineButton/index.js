//import supportedEngineCategoryType from '../SearchBar';
import { func, string, object } from 'prop-types';
import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import cx from 'classnames';
;
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import styles from '../../../styles.scss';



class EngineButton extends React.Component {

  static propTypes = {
    //engineCategory: shape(supportedEngineCategoryType),
    onClick: func,
    backgroundColor: string,
    selectedColor: string,
    color: string,
    engineCategory: object
  };

  static defaultProps = {
    color: 'grey'
  }

  render() {

    const { engineCategory, onClick, selectedColor, color } = this.props;


    const handleClick = () => onClick(engineCategory.id);

    return (
      <Tooltip
        title={engineCategory.title}
        placement="bottom"
        id={engineCategory.id}
      >
        <Button  size='small' color={selectedColor} onClick={handleClick} style={{minWidth: '0px'}}>
          <Icon className={engineCategory.iconClass} color={color}  />
        </Button>
      </Tooltip>
    );
  }
}

export default EngineButton;
