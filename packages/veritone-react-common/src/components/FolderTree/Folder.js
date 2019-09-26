/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { arrayOf, bool, shape, number, objectOf, oneOfType, string } from "prop-types";
import _ from "lodash";
import { Collapse, List, ListItem, ListItemText } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import cx from "classnames";

import stylesLocal from './styles.scss';

const styles = {
  subFolder: {
    marginLeft: 20,
    display: "block",
    padding: 0
  },
  folder: {
    padding: 2,
    cursor: "pointer"
  },
  rootFolder: {
    paddingLeft: 20,
    backgroundColor: "lightgrey"
  },
  rootFolderActive: {
    paddingLeft: 15,
    borderLeft: "5px solid #2196F3"
  },
  iconShare: {
    color: "#2196F3"
  },
  folderLabel: {
    fontWeight: "500"
  }
};

class Folder extends Component {
  static propTypes = {
    folder: shape(Object),
    classes: objectOf(string),
    subfolders: arrayOf(shape(Object)),
    folders:  shape(Object),
    forbiddenList: arrayOf(oneOfType([number, string])),
    searching: bool,
    searchValue: string,
  };

  state = {
    onlyShowDataSearch: true
  };

  get folderIcon() {
    const { folder, highlightedFolderIds, isRootFolder } = this.props;
    if (isRootFolder) {
      const selected = highlightedFolderIds === folder.id ? stylesLocal['root-folder-icon'] : null;
      return (
        <div className={cx([
          'icon-work',
          stylesLocal['folder-item'],
          selected
        ])} />
      )
    } else {
      const folderIcon = highlightedFolderIds === folder.id ? 'icon-open-folder'
        : (folder.subfolders.length || folder.subcontents.length) ? 'icon-full-folder' : 'icon-empty-folder'
      return (
        <div className={cx([
          folderIcon,
          styles['folder-icon']
        ])} />
      )
    }
  }
  get folderLabel() {
    const { isRootFolder, folder } = this.props;
    if (isRootFolder) {
      return 'My Organization'
    }
    return folder.name || "Untitled";
  }

  handleClick = (event) => {
  };

  render() {
    const {
      subfolders = [],
      subcontents = [],
      folder,
      folders,
      contents,
      classes,
      forbiddenList = [],
      selectedFolderIds = [],
      highlightedFolderIds = [],
      searching,
      searchValue
    } = this.props;
    const { onlyShowDataSearch } = this.state;
    if (_.includes(forbiddenList, folder.id)) {
      return null;
    }
    const hideFolder = onlyShowDataSearch && searching && !folder.searchResult && !_.includes(folder.name.toLowerCase(), searchValue.toLowerCase());
    const folderId = folder.id;
    return (
      !hideFolder &&
      <List className={classes.folder}>
        <ListItem
          onClick={this.handleClick}
          className={this.folderStyle}>
          {this.folderIcon}
          <ListItemText primary={this.folderLabel} />
        </ListItem>
        <Collapse in style={{ padding: 0 }}>
          <List component="div" disablePadding className={classes.subFolder}>
            {
              subfolders.map(subfolder => {
                const nestedSubfolders = subfolder.subfolders || [];
                const nestedSubcontents = subfolders.subcontents || [];
                return (
                  <Folder
                    key={subfolder.id}
                    selectedFolderIds={selectedFolderIds}
                    highlightedFolderIds={highlightedFolderIds}
                    rootIds={folders.rootIds}
                    onClick={this.handleClick}
                    folder={folders.byId[folderId]}
                    subfolders={nestedSubfolders.map(subfolderId =>
                      folders.byId[subfolderId])}
                    subcontents={nestedSubcontents.map(subcontentId =>
                      contents.byId[subcontentId])}
                    folders={folders}
                    contents={contents}
                    searching={searching}
                  />
                );
              })
            }
            {/* {
              subcontents.map(subfolder => {
                const nestedSubfolders = subfolder.subfolders || [];
                const nestedSubcontents = subfolders.subcontents || [];
                return (
                  <ListItem
                    key={subfolder.id}
                    selectedFolderIds={selectedFolderIds}
                    highlightedFolderIds={highlightedFolderIds}
                    rootIds={folders.rootIds}
                    onClick={this.handleClick}
                    folder={folders.byId[folderId]}
                    subfolders={nestedSubfolders.map(subfolderId =>
                      folders.byId[subfolderId])}
                    subcontents={nestedSubcontents.map(subcontentId =>
                      contents.byId[subcontentId])}
                    folders={folders}
                    contents={contents}
                    searching={searching}
                  />
                );
              })
            } */}
          </List>
        </Collapse>
      </List>
    );
  }
}

export default withStyles(styles)(Folder);
