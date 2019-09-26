import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import FolderItem from './FolderItem';

import styles from './styles.scss';

const useStyles = makeStyles(theme => ({
  root: {
    width: 240,
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

export default function NestedList() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  function handleClick() {
    setOpen(!open);
  };

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={cx(styles['folder-tree-container'])}
    >
      <ListItem button>
        <FolderItem opening hasContent folderName="Collection folder 1" />
      </ListItem>
      <ListItem button>
        <FolderItem opening={false} hasContent={false} folderName="Collection folder 2" />
      </ListItem>
      <ListItem button onClick={handleClick}>
        {/* {open ? <ExpandLess /> : <ExpandMore />} */}
        <FolderItem opening={false} hasContent folderName="Collection folder 3" />
      </ListItem>
    </List>
  );
}
