import React from 'react';
import { shape, string, number, func } from 'prop-types';
import { connect } from 'react-redux';
import * as folderSelectionModule from '../../redux/modules/folderSelectionDialog';
import cx from 'classnames';
import FolderIcon from '@material-ui/icons/Folder';
import FolderList from './FolderList';
import ExpandLess from '@material-ui/icons/ArrowDropDown';
import ExpandMore from '@material-ui/icons/ArrowRight';
import styles from './styles.scss';

@connect(
  state => ({
    selectedFolder: folderSelectionModule.selectedFolder(state)
  }),
  {
    selectFolder: folderSelectionModule.selectFolder,
    getAllSubFolders: folderSelectionModule.getAllSubFolders
  }
)
export default class CollapsibleFolder extends React.Component {
  static propTypes = {
    folder: shape({
      id: string,
      treeObjectId: string,
      orderIndex: number,
      name: string,
      description: string,
      modifiedDateTime: string,
      status: string,
      ownerId: string,
      typeId: number,
      parent: shape({
        treeObjectId: string
      }),

      childFolders: shape({
        count: number
      })
    }),

    selectFolder: func,
    getAllSubFolders: func,
    selectedFolder: shape({
      id: string,
      treeObjectId: string,
      orderIndex: number,
      name: string,
      description: string,
      modifiedDateTime: string,
      status: string,
      ownerId: string,
      typeId: number,
      parent: shape({
        treeObjectId: string
      }),

      childFolders: shape({
        count: number
      })
    })
  };

  state = {
    open: false
  };

  handleClick = () => {
    // open or close collapsible folder - refetch subfolders whenever opening but not closing and select the folder the clicked on
    const { folder, selectFolder, getAllSubFolders } = this.props;
    if (!this.state.open) {
      getAllSubFolders(folder);
    }
    this.setState(prevState => ({
      open: !prevState.open
    }));
    selectFolder(folder);
  };

  render() {
    // the collapsible folder has subfolders which are rendered when open by passing a listId into FolderList component
    const { folder, selectedFolder } = this.props;
    let listId = folder.treeObjectId;
    let selectedId = selectedFolder.treeObjectId;
    let idsMatch = listId === selectedId;

    return (
      <li>
        <div
          className={cx(styles.folder, idsMatch && styles.selected)}
          onClick={this.handleClick}
        >
          {this.state.open ? (
            <ExpandLess style={{ fontSize: '30px' }} />
          ) : (
            <ExpandMore style={{ fontSize: '30px' }} />
          )}

          <FolderIcon className={styles.collapsibleFolderIcon} />

          <div
            className={cx(
              styles.folderName,
              idsMatch && styles.folderNameSelected
            )}
          >
            {folder.name}
          </div>
        </div>
        <ul>{this.state.open ? <FolderList listId={listId} /> : <div />}</ul>
      </li>
    );
  }
}
