/* eslint-disable react/jsx-no-bind */
import React from "react";
import {
  arrayOf,
  bool,
  shape,
  string,
  oneOfType,
  number,
  func
} from "prop-types";
import cx from "classnames";
import _ from "lodash";
import {
  Collapse,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  CircularProgress
} from "@material-ui/core";

import ExpandIcon from './Component/ExpandIcon';
import FolderIcon from './Component/FolderIcon';
import Menu from './Menu';
import styles from './styles.scss';
import { getAllChildId } from './index';

function Folder({
  opening = [],
  folders,
  childs,
  folder,
  selected,
  isRootFolder,
  onChange,
  onExpand,
  selectable,
  isEnableShowingContent,
  folderAction,
  onMenuClick,
  searchingStatus,
  processingFolder
}) {
  const folderId = _.get(folder, 'id');
  const isOpening = _.includes(opening, folderId);
  const folderLabel = _.get(folder, 'name', 'My organization');
  const selectedIds = Object.keys(selected);
  const isChecked = id => _.includes(selectedIds, id);

  const isIndeterminate = folderId => {
    const folder = folders.byId[folderId];
    const childs = _.flattenDeep(getAllChildId(folder, folders));
    const diff = _.difference(childs, selectedIds);
    return diff.length > 0 && childs.length !== 0 && diff.length < childs.length;
  };

  const isProgressing = _.includes(processingFolder, folderId);

  const onChangeItem = folder => () => {
    onChange(folder);
  };

  if (_.isNil(folder)) {
    return null;
  }

  if (folder.contentType !== 'folder' && !isEnableShowingContent) {
    return null;
  }

  return (
    <List className={cx(styles['folder'])}>
      <ListItem
        button
        data-id={folderId}
        onClick={onChangeItem(folder)}
        className={cx({
          [styles['folder-list-item']]: true,
          [styles['highlighted']]: _.includes(selectedIds, folderId) && !selectable,
          [styles['list-item']]: true
        })}
      >
        {!searchingStatus && (
          <ExpandIcon
            onExpand={onExpand}
            folder={folder}
            opening={opening}
            isEnableShowingContent={isEnableShowingContent}
          />
        )}
        {selectable && (
          <Checkbox
            checked={isChecked(folderId)}
            indeterminate={isIndeterminate(folderId)}
            color="primary"
          />
        )}
        <FolderIcon
          folder={folder}
          highlightedIds={selectedIds}
          isRootFolder={isRootFolder}
          isOpening={isOpening}
          selectable={selectable}
        />
        <ListItemText
          className={cx(styles['list-item-text'])}
          primary={folderLabel}
        />
        {isProgressing && (
          <div className={cx(styles['icon-progress'])}>
            <CircularProgress
              variant="indeterminate"
              size={20}
            />
          </div>
        )}
        <div className={cx(styles['icon-menu'])}>
          <Menu
            folderAction={folderAction}
            folder={folder}
            onMenuClick={onMenuClick}
          />
        </div>

      </ListItem>
      <Collapse in={isOpening} style={{ padding: 0 }}>
        <List disablePadding className={cx(styles['sub-folder'])}>
          {
            childs.map(child => {
              const nestedChilds = child.childs || [];
              return (
                <Folder
                  key={child.id}
                  isRootFolder={false}
                  selectable={selectable}
                  selected={selected}
                  isEnableShowingContent={isEnableShowingContent}
                  onChange={onChange}
                  opening={opening}
                  onExpand={onExpand}
                  rootIds={folders.rootIds}
                  folder={folders.byId[child.id]}
                  childs={nestedChilds.map(childId =>
                    folders.byId[childId] || {})}
                  folders={folders}
                  folderAction={folderAction}
                  onMenuClick={onMenuClick}
                  searchingStatus={searchingStatus}
                  processingFolder={processingFolder}
                />
              );
            })
          }
        </List>
      </Collapse>
    </List>
  );
}

Folder.propTypes = {
  childs: arrayOf(Object),
  opening: arrayOf(oneOfType([number, string])),
  folders: shape(Object),
  folder: shape(Object),
  selected: shape(Object),
  isRootFolder: bool,
  onChange: func,
  onExpand: func,
  selectable: bool,
  isEnableShowingContent: bool,
  folderAction: arrayOf(Object),
  onMenuClick: func,
  searchingStatus: bool,
  processingFolder: arrayOf(string)
}

export default Folder;
