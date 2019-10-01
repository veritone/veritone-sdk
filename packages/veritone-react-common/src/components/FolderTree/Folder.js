/* eslint-disable react/jsx-no-bind */
import React from "react";
import { arrayOf, bool, shape, string, oneOfType, number, func } from "prop-types";
import cx from "classnames";
import _ from "lodash";

import { Collapse, List, ListItem, ListItemText, Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { getAllChildId } from './FolderTree';

import Menu from './Menu';
import styles from './styles.scss';

const useStyles = makeStyles({
  subFolder: {
    display: "block",
    padding: 0,
    marginLeft: 20
  },
  folder: {
    padding: '2px 0',
    cursor: "pointer"
  },
  itemStyles: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 0
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
  },
  highlighted: {
    backgroundColor: 'rgba(0,0,0,0.07) !important'
  }
})

function FolderIcon({
  folder,
  highlightedIds,
  isRootFolder,
  isOpening,
  selectable
}) {
  if (isRootFolder) {
    const selected = _.includes(highlightedIds, folder.id) ? styles['selected'] : null;
    return (
      <div className={cx([
        'icon-work',
        styles['folder-item'],
        selected
      ])} />
    )
  }
  const folderIcon = (isOpening || (_.includes(highlightedIds, folder.id) && !selectable))
    ? 'icon-open-folder'
    : (folder.childs && folder.childs.length) ? 'icon-full-folder' : 'icon-empty-folder'
  switch (folder.contentType) {
    case 'folder':
      return (
        <div className={cx([
          folderIcon,
          styles['folder-icon']
        ])} />
      );
    case 'collection':
      return (
        <div className={cx([
          'icon-collections2',
          styles['content-icon']
        ])} />);
    case 'watchlist':
      return (
        <div className={cx([
          'icon-watchlist',
          styles['content-icon']
        ])} />);
    case 'tdo':
      return (
        <div className={cx([
          'icon-applications',
          styles['content-icon']
        ])} />);
    default:
      return (
        <div className={cx([
          'icon-results',
          styles['content-icon']
        ])} />);
  }
}
FolderIcon.propTypes = {
  folder: shape(Object),
  highlightedIds: oneOfType(number, string),
  isRootFolder: bool,
  isOpening: bool,
  selectable: bool,
}

function ExpandIcon({ folder, opening, onExpand, isEnableShowingContent }) {
  const expanded = _.includes(opening, folder.id);
  const expandStyle = expanded ? 'icon-sort-desc' : 'icon-caret-right';
  if (!folder.childs || folder.childs.length === 0) {
    return (
      <div style={{
        width: 30
      }}
      />
    )
  }
  if (
    !isEnableShowingContent &&
    folder.contentType === 'folder' &&
    folder.subfolders.length === 0
  ) {
    return (
      <div style={{
        width: 30
      }}
      />
    )
  }
  return (
    <div
      onClick={onExpand(folder.id)}
      className={cx([
        expandStyle,
        styles['expand-icon']
      ])}
    />
  )
}
ExpandIcon.propTypes = {
  folder: shape(Object),
  onExpand: func,
  opening: arrayOf(oneOfType([number, string])),
  isEnableShowingContent: bool
}

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
}) {
  const [hovering, sethovering] = React.useState(null);
  function onMouseEnter(e) {
    const id = e.target.getAttribute('data-id');
    sethovering(parseInt(id));
  }
  function onMouseLeave() {
    sethovering(null);
  }
  const classes = useStyles();
  const isOpening = _.includes(opening, folder.id);
  const folderLabel = isRootFolder ? 'My organization' : folder.name || "Untitled";
  const selectedIds = Object.keys(selected).map(item => parseInt(item));
  const isChecked = id => _.includes(selectedIds, id);

  const isIndeterminate = folderId => {
    const folder = folders.byId[folderId];
    const childs = _.flattenDeep(getAllChildId(folder, folders));
    const diff = _.difference(childs, selectedIds);
    return diff.length > 0 && childs.length !== 0 && diff.length < childs.length;
  }

  const onChangeItem = folder => e => {
    onChange(folder);
  }

  if (folder.contentType !== 'folder' && !isEnableShowingContent) {
    return null;
  }

  return (
    <List className={classes.folder}>
      <ListItem
        button
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        data-id={folder.id}
        onClick={onChangeItem(folder)}
        className={cx({
          [classes.folder]: true,
          [classes.highlighted]: _.includes(selectedIds, folder.id) && !selectable
        })}
      >
        <ExpandIcon
          onExpand={onExpand}
          folder={folder}
          opening={opening}
          isEnableShowingContent={isEnableShowingContent}
        />
        {selectable && (
          <Checkbox
            checked={isChecked(folder.id)}
            indeterminate={isIndeterminate(folder.id)}
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
        <ListItemText primary={folderLabel} />
        {hovering === folder.id && <Menu />}
      </ListItem>
      <Collapse in={isOpening} style={{ padding: 0 }}>
        <List component="div" disablePadding className={classes.subFolder}>
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
                    folders.byId[childId])}
                  folders={folders}
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
  isEnableShowingContent: bool
}

export default Folder;
