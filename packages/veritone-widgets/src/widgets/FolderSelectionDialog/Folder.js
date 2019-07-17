import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import {  objectOf, any, func, string } from 'prop-types';
import * as folderSelectionModule from '../../redux/modules/folderSelectionDialog';
import ListItem from '@material-ui/core/ListItem';
import FolderIcon from '@material-ui/icons/Folder';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import styles from './styles.scss';

@connect(
  (state) => ({
    selectedFolder: folderSelectionModule.selectedFolder(state),
   
  }),
  {
    selectFolder: folderSelectionModule.selectFolder,
  },
  null,
  { withRef: true }

)


export default class Folder extends React.Component {
  static propTypes = {
    folder: objectOf(any),
    selectFolder: func,
    selectedFolder: string
  };

  handleClick = () => {
    const { folder, selectFolder } = this.props;
    selectFolder(folder.treeObjectId);
   
  }

  render(){
    const { folder, selectedFolder } = this.props;
  
    return (
      <ListItem className={cx(folder.treeObjectId === selectedFolder && styles.selected)} button onClick={this.handleClick} >
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
  
