import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { shape, number, string, func, any } from 'prop-types';
import FolderIcon from '@material-ui/icons/Folder';
import { withStyles } from '@material-ui/styles';

import * as folderSelectionModule from '../../redux/modules/folderSelectionDialog';
import styles from './styles';

@withStyles(styles)
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
    }),
    classes: shape({ any }),
  };

  handleClick = () => {
    const { folder, selectFolder } = this.props;
    selectFolder(folder);
  };

  render() {
    const { folder, selectedFolder, classes } = this.props;
    const listId = folder.treeObjectId;
    const selectedId = selectedFolder.treeObjectId;
    const idsMatch = listId === selectedId;

    return (
      <li>
        <div
          className={cx(classes.folder, idsMatch && classes.selected)}
          onClick={this.handleClick}
        >
          <FolderIcon className={classes.folderIcon} />
          <div
            className={cx(
              classes.folderName,
              idsMatch && classes.folderNameSelected
            )}
          >
            {folder.name}
          </div>
        </div>
      </li>
    );
  }
}
