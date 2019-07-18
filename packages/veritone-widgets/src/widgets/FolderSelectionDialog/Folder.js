import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import {  objectOf, any, func, string } from 'prop-types';
import * as folderSelectionModule from '../../redux/modules/folderSelectionDialog';
import FolderIcon from '@material-ui/icons/Folder';
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
      <li>
        <div className={cx(styles.folder, folder.treeObjectId === selectedFolder && styles.selected)} onClick={this.handleClick}>
          <FolderIcon className={styles.folderIcon}/>
          <div className={cx(styles.folderName, folder.treeObjectId === selectedFolder && styles.folderNameSelected)}>{folder.name}</div>
        </div>
      </li>
    );
  }
}
  
