import React from "react";
import { arrayOf, bool, shape, string, oneOfType, number, func } from "prop-types";
import cx from "classnames";
import _ from "lodash";

import { Collapse, List, ListItem, ListItemText, Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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

function FolderIcon({ folder, highlightedIds, isRootFolder, isOpening }) {
  if (isRootFolder) {
    const selected = highlightedIds === folder.id ? styles['selected'] : null;
    return (
      <div className={cx([
        'icon-work',
        styles['folder-item'],
        selected
      ])} />
    )
  }
  const folderIcon = (isOpening || folder.id === highlightedIds) ? 'icon-open-folder'
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
  isOpening: bool
}

function ExpandIcon({ folder, opening, handleOpenFolder, isEnableShowingContent }) {
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
      data-id={folder.id}
      onClick={handleOpenFolder(folder.id)}
      className={cx([
        expandStyle,
        styles['expand-icon']
      ])}
    />
  )
}
ExpandIcon.propTypes = {
  folder: shape(Object),
  handleOpenFolder: func,
  opening: bool,
  isEnableShowingContent: bool
}

function Folder({
  opening = [],
  folders,
  childs,
  folder,
  contents,
  selectedFolderIds = [],
  highlightedIds,
  searching,
  isRootFolder,
  handleClickFolder,
  handleOpenFolder,
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
  const isChecked = (id) => _.includes(selectedFolderIds, id);
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
        onClick={handleClickFolder(folder)}
        className={cx({
          [classes.folder]: true,
          [classes.highlighted]: highlightedIds === folder.id
        })}
      >
        <ExpandIcon
          handleOpenFolder={handleOpenFolder}
          folder={folder}
          opening={opening}
          isEnableShowingContent={isEnableShowingContent}
        />
        {selectable && (
          <Checkbox
            checked={isChecked(folder.id)}
            color="primary"
          />
        )}
        <FolderIcon
          folder={folder}
          highlightedIds={highlightedIds}
          isRootFolder={isRootFolder}
          isOpening={isOpening}
        />
        <ListItemText primary={folderLabel} />
        {hovering === folder.id && <Menu />}
      </ListItem>
      <Collapse in={isOpening} style={{ padding: 0 }}>
        <List component="div" disablePadding className={classes.subFolder}>
          {
            childs.map(child => {
              console.log(child)
              const nestedChilds = child.childs || [];
              return (
                <Folder
                  isRootFolder={false}
                  key={child.id}
                  classes={classes}
                  opening={opening}
                  selectable={selectable}
                  isEnableShowingContent={isEnableShowingContent}
                  selectedFolderIds={selectedFolderIds}
                  highlightedIds={highlightedIds}
                  rootIds={folders.rootIds}
                  handleClickFolder={handleClickFolder}
                  handleOpenFolder={handleOpenFolder}
                  folder={folders.byId[child.id]}
                  childs={nestedChilds.map(childId =>
                    folders.byId[childId])}
                  folders={folders}
                  contents={contents}
                  searching={searching}
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
  opening: bool,
  folders: shape(Object),
  folder: shape(Object),
  contents: shape(Object),
  selectedFolderIds: arrayOf(oneOfType(number, string)),
  highlightedIds: oneOfType(number, string),
  searching: bool,
  isRootFolder: bool,
  handleClickFolder: func,
  handleOpenFolder: func,
  selectable: bool,
  isEnableShowingContent: bool
}

export default Folder;
