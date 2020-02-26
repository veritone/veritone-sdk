import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { shape, number, string, func } from 'prop-types';
import FolderIcon from '@material-ui/icons/Folder';

import * as folderSelectionModule from '../../redux/modules/folderSelectionDialog';
import { withStyles } from '../../shared/withStyles';
import styles from './styles';
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
  };

  handleClick = () => {
    const { folder, selectFolder } = this.props;
    selectFolder(folder);
  };

  render() {
    const classes = withStyles(styles);
    const { folder, selectedFolder } = this.props;
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
