/* eslint-disable react/jsx-no-bind */
import React, { useState } from "react";
import { arrayOf, bool, func, number, shape } from "prop-types";
import _ from 'lodash';
import cx from "classnames";
import CircularProgress from "@material-ui/core/CircularProgress";

import Folder from "./Folder";
import styles from "./styles.scss";

const getAllChildId = (item) => {
  if (_.isNil(item.childs) || _.isEmpty(item.childs)) {
    return [item.id]
  }
  else {
    return [item.id, ...item.childs.map(subitem => getAllChildId(subitem))]
  }
}

function FolderTree({
  selectable,
  loading,
  foldersData,
  onChange,
  onExpand,
  isEnableShowContent,
  selected
}) {
  const [opening, setopening] = useState([]);
  const handleOpenFolder = folderId => event => {
    event.stopPropagation();
    const newOpening = _.includes(opening, folderId) ? opening.filter(item => item !== folderId) : [...opening, folderId];
    setopening(newOpening);
    onExpand(folderId);
  }
  if (loading) {
    return (<div className={cx(styles["loading"])}><CircularProgress /></div>);
  }
  return (
    <div>
      {foldersData.rootIds.map(folderId => {
        const childs = foldersData.byId[folderId].childs || [];
        return (
          <Folder
            key={folderId}
            isRootFolder
            selectable={selectable}
            selected={selected}
            isEnableShowingContent={isEnableShowContent}
            onChange={onChange}
            opening={opening}
            onExpand={handleOpenFolder}
            rootIds={foldersData.rootIds}
            folder={foldersData.byId[folderId]}
            childs={childs.map(childId =>
              foldersData.byId[childId])}
            folders={foldersData}
          />
        );
      })}
    </div>
  )
}

FolderTree.propTypes = {
  selectable: bool,
  loading: bool,
  foldersData: shape(Object),
  selected: shape(Object),
  onChange: func,
  onExpand: func,
  isEnableShowContent: bool
};

export default FolderTree;
