import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
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
