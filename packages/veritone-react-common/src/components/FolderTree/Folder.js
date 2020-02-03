/* eslint-disable react/jsx-no-bind */
import React from 'react';
import {
  arrayOf,
  bool,
  shape,
  func,
  number
} from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import {
  Collapse,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ExpandIcon from './Component/ExpandIcon';
import FolderIcon from './Component/FolderIcon';
import styles from './styles';
import Menu from './Menu';
import { getAllChildId } from './index';

const useStyles = makeStyles(theme => ({
  ...styles
}));

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
  processingFolder,
  level
}) {
  const classes = useStyles();
  const folderId = _.get(folder, 'id');
  const isOpening = _.includes(opening, folderId);
  const folderLabel = _.get(folder, 'name', 'My organization');
  const selectedIds = Object.keys(selected).map(item => {
    if (!isNaN(item)) {
      return parseInt(item);
    }
    return item;
  });
  const isChecked = id => _.includes(selectedIds, !isNaN(id) ? parseInt(id) : id);

  const isIndeterminate = folderId => {
    const folder = folders.byId[folderId];
    const childs = _.flattenDeep(getAllChildId(folder, folders));
    const childsReprocess = childs.map(item => {
      if (!isNaN(item)) {
        return parseInt(item);
      }
      return item;
    })
    const diff = _.difference(childsReprocess, selectedIds);
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
    <List className={classes.folder}>
      <ListItem
        data-id={folderId}
        onClick={onChangeItem(folder)}
        className={cx({
          [classes.highlighted]: _.includes(selectedIds, folderId) && !selectable,
          [classes.listItem]: true
        })}
      >
        <div style={{ minWidth: level * 15, width: level * 15 }} />
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
          className={classes.listItemText}
          primary={folderLabel}
        />
        {isProgressing && (
          <div className={classes.iconProgress}>
            <CircularProgress
              variant="indeterminate"
              size={16}
            />
          </div>
        )}
        {folderAction.length > 0 && !isRootFolder && (
          <div className={classes.iconMenu}>
            <Menu
              folderAction={folderAction}
              folder={folder}
              onMenuClick={onMenuClick}
            />
          </div>
        )}
      </ListItem>
      <Collapse in={isOpening} style={{ padding: 0 }}>
        <List disablePadding>
          {
            childs.map(child => {
              const nestedChilds = child.childs || [];
              if (_.isEmpty(child)) {
                return null;
              }
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
                  level={level + 1}
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
  opening: arrayOf(Object),
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
  processingFolder: arrayOf(Object),
  level: number
}

export default Folder;
