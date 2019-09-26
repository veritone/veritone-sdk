import React, { Component } from "react";
import { arrayOf, bool, func, number, shape, string } from "prop-types";
import cx from "classnames";
import CircularProgress from "@material-ui/core/CircularProgress";

import Folder from "./Folder";
import styles from "./styles.scss";

class FolderTree extends Component {
  static propTypes = {
    toggleFolder: func,
    folders: shape(Object),
    contents: shape(Object),
    searching: bool,
    selectedFolderIds: arrayOf(number),
    highlightedFolderIds: arrayOf(number),
    unsetSearchResult: func
  };

  state = {
    loading: false,
    loaded: false
  };

  componentWillUnmount() {
    this.unMounting = true;
  }

  startLoading = () => {
    this.setState({
      loading: true
    });
  };

  finishedLoading = () => {
    this.setState({
      loading: false,
      loaded: true
    });
  };

  handleClick = (folderId) => {
    const { toggleFolder } = this.props;
    toggleFolder(folderId);
  };

  handleUnsetSearchResult = (folderId) => {
    const { unsetSearchResult } = this.props;
    unsetSearchResult(folderId);
  };

  render() {
    const { loading } = this.state;
    if (loading) {
      return <div className={cx(styles["loading"])}><CircularProgress /></div>;
    }
    const {
      folders = {},
      contents = {},
      searching,
      selectedFolderIds = [],
      highlightedFolderIds = []
    } = this.props;
    return (
      <div>
        {
          folders.rootIds.map(folderId => {
            const subfolders = folders.byId[folderId].subfolders || [];
            const subcontents = folders.byId[folderId].subcontents || [];
            return (
              <Folder
                isRootFolder
                key={folderId}
                selectedFolderIds={selectedFolderIds}
                highlightedFolderIds={highlightedFolderIds}
                rootIds={folders.rootIds}
                onClick={this.handleClick}
                folder={folders.byId[folderId]}
                subfolders={subfolders.map(subfolderId =>
                  folders.byId[subfolderId])}
                subcontents={subcontents.map(subcontentId => 
                  contents.byId[subcontentId])}
                folders={folders}
                contents={contents}
                searching={searching}
              />
            );
          })
        }
      </div>
    );
  }
}

export default FolderTree;