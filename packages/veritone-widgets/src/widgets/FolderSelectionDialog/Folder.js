import React from 'react';
import cx from 'classnames';
import {  objectOf, any } from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import FolderIcon from '@material-ui/icons/Folder';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import styles from './styles.scss';

export default class Folder extends React.Component {
  static propTypes = {
    folder: objectOf(any)
   
  };

  handleClick = () => {
    const { folder } = this.props;
    console.log(folder)
  }

  render(){
    const { folder } = this.props;
    
    return (
      <ListItem className={cx(folder.id === "972bd32d-3257-4c44-9d0e-7d51bfaef6d1" && styles.selected)} button onClick={this.handleClick} >
        <ListItemIcon >
        <FolderIcon style ={{color: "#F0C56A", marginLeft: "24px"}}/>
        </ListItemIcon>
        <ListItemText 
        primary={folder.name}
        />
      </ListItem>
    );
  }
}
  
