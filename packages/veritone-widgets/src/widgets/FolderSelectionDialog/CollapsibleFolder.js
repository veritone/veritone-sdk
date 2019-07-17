import React from 'react';
import { objectOf, func, arrayOf, object, any, string } from 'prop-types';
import { connect } from 'react-redux';

import * as folderSelectionModule from '../../redux/modules/folderSelectionDialog';
import cx from 'classnames';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import FolderIcon from '@material-ui/icons/Folder';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import ListItemText from '@material-ui/core/ListItemText';
import FolderList from './FolderList';
import Collapse from '@material-ui/core/Collapse';

import ExpandLess from '@material-ui/icons/ExpandMore';
import ExpandMore from '@material-ui/icons/ChevronRight';
import styles from './styles.scss';


@connect(
  (state) => ({
    selectedFolder: folderSelectionModule.selectedFolder(state),
    subFolderList: folderSelectionModule.subFolderList(state)
  }),
  {
    selectFolder: folderSelectionModule.selectFolder,
    getAllSubFolders: folderSelectionModule.getAllSubFolders
  },
  null,
  { withRef: true }

)

export default class CollapsibleFolder extends React.Component {
  static propTypes = {
    folder: objectOf(any),
    selectFolder: func,
    getAllSubFolders: func,
    subFolderList: arrayOf(object),
    selectedFolder: string
  };

  state = { 
    open: false,
  }
  
  
  handleClick = () => {
    
    const { folder, selectFolder, getAllSubFolders } = this.props;
    getAllSubFolders(folder);
    this.setState((prevState) => ({
      open : !prevState.open,
      folderId: folder.treeObjectId
    }))
    selectFolder(folder.treeObjectId);
  }

  renderSubFolders(){
    let {subFolderList, folder} = this.props;
    if (this.props.subFolderList){
      let records  = subFolderList.filter((subfolder) => { 
        if (subfolder){
          if (subfolder.parent.treeObjectId === folder.treeObjectId){
            return subfolder
          }
        }
      });
      return <FolderList  list={records}/>;
    }
  }

  render() {
    
    const { folder, selectedFolder } = this.props;
    return (
      <List disablePadding>
        <ListItem className={cx(folder.treeObjectId === selectedFolder && styles.selected)} button onClick={this.handleClick}>
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
          <ListItemIcon>
            <FolderIcon style ={{color: "#F0C56A"}}/>
          </ListItemIcon>
        <ListItemText primary={folder.name} />
        
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <div style={{paddingLeft: "25px"}}>
            {this.renderSubFolders()}
          </div>
        </Collapse>
      </List>
    );
  }
}


