import React from 'react';
import { objectOf, func, arrayOf, object, any, string } from 'prop-types';
import { connect } from 'react-redux';
import * as folderSelectionModule from '../../redux/modules/folderSelectionDialog';
import cx from 'classnames';
import FolderIcon from '@material-ui/icons/Folder';
import FolderList from './FolderList';
import ExpandLess from '@material-ui/icons/ArrowDropDown';
import ExpandMore from '@material-ui/icons/ArrowRight';
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
    subFolderList: objectOf(any),
    selectedFolder: objectOf(any)
  };

  state = { 
    open: false,
  }
  
  
  handleClick = () => {
    
    const { folder, selectFolder, getAllSubFolders } = this.props;
    if(!this.state.open){
      getAllSubFolders(folder);
    }

    this.setState((prevState) => ({
      open : !prevState.open,
      folderId: folder.treeObjectId
    }))
    selectFolder(folder);
  }

  renderSubFolders(){
    let {subFolderList, folder} = this.props;
    console.log(subFolderList)
    let property  = folder.treeObjectId;
    console.log(property)
    let records = subFolderList[property]
    console.log(records)
    if (records){

      return <FolderList  list={records}/>;
    }
  }

  render() {
    
    const { folder, selectedFolder } = this.props;
    return (
        <li>
          <div className={cx(styles.folder, folder.treeObjectId === selectedFolder.treeObjectId && styles.selected)} onClick={this.handleClick}>
            {this.state.open ? <ExpandLess style ={{fontSize: "30px"}}/> : <ExpandMore style ={{fontSize: "30px"}}  />}
       
            <FolderIcon className={styles.collapsibleFolderIcon}/>
         
            <div className={cx(styles.folderName, folder.treeObjectId === selectedFolder && styles.folderNameSelected)}>{folder.name}</div>
          </div>
          <ul>
            {(this.state.open)?  this.renderSubFolders() : <div/>}
          </ul>
        </li>
    );
  }
}


