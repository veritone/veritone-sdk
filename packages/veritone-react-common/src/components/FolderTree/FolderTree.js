/* eslint-disable react/jsx-no-bind */
import React, { Component, useState } from "react";
import { arrayOf, bool, func, number, shape } from "prop-types";
import _ from 'lodash';
import cx from "classnames";
import CircularProgress from "@material-ui/core/CircularProgress";

import Folder from "./Folder";
import styles from "./styles.scss";

function FolderTree({
  folders,
  contents,
  searching,
  selectedFolderIds = [],
  highlightedFolderIds = [],
  loading,
  isEnableShowContent = false,
}) {
  const [opening, setopening] = useState([]);
  const [selected, setselected] = useState([]);
  const [highlighted, sethighlighted] = useState();
  function handleOpenFolder(e) {
    e.stopPropagation();
    const folderId = parseInt(e.target.getAttribute('data-id'));
    console.log(folderId);
    const newOpening = _.includes(opening, folderId) ? opening.filter(item => item !== folderId) : [...opening, folderId];
    setopening(newOpening);
  }
  const handleClick = item => e => {
    const { id } = item;
    console.log(item);
    sethighlighted(id);
  }
  if (loading) {
    return (<div className={cx(styles["loading"])}><CircularProgress /></div>);
  }
  console.log(opening);
  return (
    <div>
      {folders.rootIds.map(folderId => {
        const subfolders = folders.byId[folderId].subfolders || [];
        const subcontents = folders.byId[folderId].subcontents || [];
        return (
          <Folder
            isRootFolder
            key={folderId}
            opening={opening}
            handleClick={handleClick}
            handleOpenFolder={handleOpenFolder}
            selectedFolderIds={selectedFolderIds}
            isEnableShowContent={isEnableShowContent}
            highlightedIds={highlighted}
            rootIds={folders.rootIds}
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
      })}
    </div>
  )
}

FolderTree.propTypes = {
  toggleFolder: func,
  selectFolder: func,
  folders: shape(Object),
  contents: shape(Object),
  searching: bool,
  selectedFolderIds: arrayOf(number),
  highlightedFolderIds: arrayOf(number),
  loading: bool,
  isEnableShowContent: bool
};

export default FolderTree;
