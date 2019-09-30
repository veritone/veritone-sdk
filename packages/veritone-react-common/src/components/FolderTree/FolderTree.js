/* eslint-disable react/jsx-no-bind */
import React, { useState } from "react";
import { arrayOf, bool, func, number, shape } from "prop-types";
import _ from 'lodash';
import cx from "classnames";
import CircularProgress from "@material-ui/core/CircularProgress";

import Folder from "./Folder";
import styles from "./styles.scss";

const getAllChildId = (item) => {
  if(_.isNil(item.childs) || _.isEmpty(item.childs)){
      return [item.id]
  }
  else {
      return [item.id, ...item.childs.map(subitem => getAllChildId(subitem))]
  }
}

function FolderTree({
  folders,
  contents,
  searching,
  selectable = true,
  selectedFolderIds = [],
  isEnableClickFolder = true,
  highlightedFolderIds = [],
  loading,
  isEnableShowContent = false,
}) {
  const [opening, setopening] = useState([]);
  const [selected, setselected] = useState([]);
  const [highlighted, sethighlighted] = useState();
  const handleOpenFolder = folderId => event => {
    event.stopPropagation();
    const newOpening = _.includes(opening, folderId) ? opening.filter(item => item !== folderId) : [...opening, folderId];
    setopening(newOpening);
  }
  const handleClickFolder = item => event => {
    event.stopPropagation();
    const { id } = item;
    sethighlighted(id);
  }
  const handleSelectFolder = folderId => event => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    const newSelected = _.includes(selected, folderId) ? selected.filter(item => item !== folderId) : [...selected, folderId];
    setselected(newSelected);
  }
  if (loading) {
    return (<div className={cx(styles["loading"])}><CircularProgress /></div>);
  }
  return (
    <div>
      {folders.rootIds.map(folderId => {
        const childs = folders.byId[folderId].childs || [];
        return (
          <Folder
            isRootFolder
            selectable
            isEnableShowingContent={false}
            key={folderId}
            opening={opening}
            handleClickFolder={handleClickFolder}
            handleSelectFolder={handleSelectFolder}
            handleOpenFolder={handleOpenFolder}
            selectedFolderIds={selected}
            isEnableShowContent={isEnableShowContent}
            highlightedIds={highlighted}
            rootIds={folders.rootIds}
            folder={folders.byId[folderId]}
            childs={childs.map(childId =>
              folders.byId[childId])}
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
  selectable: bool,
  folders: shape(Object),
  contents: shape(Object),
  searching: bool,
  selectedFolderIds: arrayOf(number),
  highlightedFolderIds: arrayOf(number),
  loading: bool,
  isEnableClickFolder: bool,
  isEnableShowContent: bool
};

export default FolderTree;
