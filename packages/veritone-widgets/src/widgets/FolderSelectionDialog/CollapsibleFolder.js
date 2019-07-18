import React from 'react';
import { objectOf, func, arrayOf, object, any, string } from 'prop-types';
import { connect } from 'react-redux';
import * as folderSelectionModule from '../../redux/modules/folderSelectionDialog';
import cx from 'classnames';
import FolderIcon from '@material-ui/icons/Folder';
import FolderList from './FolderList';
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
        <li>
          <div className={cx(styles.folder, folder.treeObjectId === selectedFolder && styles.selected)} onClick={this.handleClick}>
            {this.state.open ? <ExpandLess /> : <ExpandMore />}
       
            <FolderIcon className={styles.collapsibleFolderIcon}/>
         
            <div className={cx(styles.folderName, folder.treeObjectId === selectedFolder && styles.folderNameSelected)}>{folder.name}</div>
          </div>
          {(this.state.open)?  this.renderSubFolders() : <div/>}
        </li>
    );
  }
}


