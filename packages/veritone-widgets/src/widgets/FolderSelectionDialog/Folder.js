import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import {  objectOf, any, func } from 'prop-types';
import * as folderSelectionModule from '../../redux/modules/folderSelectionDialog';
import FolderIcon from '@material-ui/icons/Folder';
import styles from './styles.scss';


@connect(
  (state) => ({
    selectedFolder: folderSelectionModule.selectedFolder(state),
  }),
  {
    selectFolder: folderSelectionModule.selectFolder,
  }
)


export default class Folder extends React.Component {
  static propTypes = {
    folder: objectOf(any),
    selectFolder: func,
    selectedFolder: objectOf(any)
  };

  handleClick = () => {
    const { folder, selectFolder } = this.props;
    selectFolder(folder);
   
  }

  render(){
    const { folder, selectedFolder } = this.props;
    let listId  = folder.treeObjectId;
    let selectedId = selectedFolder.treeObjectId

    return (
      <li>
        <div className={cx(styles.folder, listId === selectedId  && styles.selected)} onClick={this.handleClick}>
          <FolderIcon className={styles.folderIcon}/>
          <div className={cx(styles.folderName, listId === selectedId  && styles.folderNameSelected)}>{folder.name}</div>
        </div>
      </li>
    );
  }
}
  
