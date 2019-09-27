/* eslint-disable react/prop-types */
import React from "react";
import { arrayOf, bool, shape, objectOf, string } from "prop-types";
import cx from "classnames";
import _ from "lodash";

import { Collapse, List, ListItem, ListItemText } from "@material-ui/core";
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
    padding: 2,
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
    : (folder.subfolders.length || folder.subcontents.length) ? 'icon-full-folder' : 'icon-empty-folder'
  return (
    <div className={cx([
      folderIcon,
      styles['folder-icon']
    ])} />
  )
}

function ExpandIcon({ folder, opening, handleOpenFolder }) {
  const expanded = _.includes(opening, folder.id);
  const expandStyle = expanded ? 'icon-sort-desc' : 'icon-caret-right';
  if (folder.subcontents.length === 0 && folder.subfolders.length === 0) {
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
      onClick={handleOpenFolder}
      className={cx([
        expandStyle,
        styles['expand-icon']
      ])}
    />
  )
}

function ContentIcon({ content }) {
  const { contentType } = content;
  switch (contentType) {
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

function Folder({
  subfolders = [],
  subcontents = [],
  opening = [],
  folders,
  folder,
  contents,
  selectedFolderIds = [],
  highlightedIds,
  searching,
  isRootFolder,
  handleClick,
  handleOpenFolder
}) {
  const [hovering, sethovering] = React.useState(false);
  function onMouseEnter() {
    sethovering(true);
  }
  function onMouseLeave() {
    sethovering(false);
  }
  const classes = useStyles();
  const isOpening = _.includes(opening, folder.id);
  const folderLabel = isRootFolder ? 'My organization' : folder.name || "Untitled";
  return (
    <List className={classes.folder}>
      <ListItem
        button
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={handleClick(folder)}
        className={cx({
          [classes.folder]: true,
          [classes.highlighted]: highlightedIds === folder.id
        })}
      >
        <ExpandIcon
          handleOpenFolder={handleOpenFolder}
          folder={folder}
          opening={opening}
        />
        <FolderIcon
          folder={folder}
          highlightedIds={highlightedIds}
          isRootFolder={isRootFolder}
          isOpening={isOpening}
        />
        <ListItemText primary={folderLabel} />
        {hovering && <Menu />}
      </ListItem>
      <Collapse in={isOpening} style={{ padding: 0 }}>
        <List component="div" disablePadding className={classes.subFolder}>
          {
            subfolders.map(subfolder => {
              const nestedSubfolders = subfolder.subfolders || [];
              const nestedSubcontents = subfolder.subcontents || [];
              return (
                <Folder
                  isRootFolder={false}
                  key={subfolder.id}
                  classes={classes}
                  opening={opening}
                  selectedFolderIds={selectedFolderIds}
                  highlightedIds={highlightedIds}
                  rootIds={folders.rootIds}
                  handleClick={handleClick}
                  handleOpenFolder={handleOpenFolder}
                  folder={folders.byId[subfolder.id]}
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
          {
            subcontents.map(subcontent => {
              return (
                <ListItem
                  key={subcontent.id}
                  button
                  // onMouseEnter={onMouseEnter}
                  // onMouseLeave={onMouseLeave}
                  className={cx({
                    [classes.folder]: true,
                    [classes.highlighted]: highlightedIds === subcontent.id
                  })}
                  onClick={handleClick(subcontent)}
                >
                  <div style={{ width: 30 }} />
                  <ContentIcon content={subcontent} />
                  <ListItemText primary={subcontent.name || 'My content'} />
                  {hovering && <Menu />}
                </ListItem>
              );
            })
          }
        </List>
      </Collapse>
    </List>
  );
}

export default Folder;
