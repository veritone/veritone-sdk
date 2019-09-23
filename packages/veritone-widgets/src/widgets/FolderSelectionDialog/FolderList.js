import React from 'react';
import { string, objectOf, shape, arrayOf, number } from 'prop-types';
import Folder from './Folder';
import CollapsibleFolder from './CollapsibleFolder';
import { connect } from 'react-redux';
import * as folderSelectionModule from '../../redux/modules/folderSelectionDialog';

@connect(state => ({
  subFolderList: folderSelectionModule.subFolderList(state)
}))
export default class FolderList extends React.Component {
  static propTypes = {
    listId: string,
    subFolderList: objectOf(
      arrayOf(
        shape(
          {
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
          }
        )
      )
    )
  };

  render() {
    // FolderList receives a listId - so it can grab correct list from redux store
    // returns a folder or collapsible folder - a collapsible folder will return another FolderList when open - see Collapsible Folder
    const { subFolderList, listId } = this.props;

    let list = subFolderList[listId];

    if (!list) {
      return <div />;
    }

    return list.map(folder => {
      let key = folder.treeObjectId;

      if (folder.childFolders && folder.childFolders.count > 0) {
        return <CollapsibleFolder key={key} folder={folder} />;
      } else {
        return <Folder key={key} folder={folder} />;
      }
    });
  }
}
