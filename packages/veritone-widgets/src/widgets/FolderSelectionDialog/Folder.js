import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { shape, number, string, func } from 'prop-types';
import * as folderSelectionModule from '../../redux/modules/folderSelectionDialog';
import FolderIcon from '@material-ui/icons/Folder';
import styles from './styles.scss';

@connect(
  state => ({
    selectedFolder: folderSelectionModule.selectedFolder(state)
  }),
  {
    selectFolder: folderSelectionModule.selectFolder
  }
)
export default class Folder extends React.Component {
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

  handleClick = () => {
    const { folder, selectFolder } = this.props;
    selectFolder(folder);
  };

  render() {
    const { folder, selectedFolder } = this.props;
    const listId = folder.treeObjectId;
    const selectedId = selectedFolder.treeObjectId;
    const idsMatch = listId === selectedId;

    return (
      <li>
        <div
          className={cx(styles.folder, idsMatch && styles.selected)}
          onClick={this.handleClick}
        >
          <FolderIcon className={styles.folderIcon} />
          <div
            className={cx(
              styles.folderName,
              idsMatch && styles.folderNameSelected
            )}
          >
            {folder.name}
          </div>
        </div>
      </li>
    );
  }
}
