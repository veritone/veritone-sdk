import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { arrayOf, shape, string } from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

function ListFileUpload({ data, checked, handleToggle, indeterminate, checkedAll }) {
  const classes = useStyles();
  return data.length ? (
    <List className={classes.root}>
      <ListItem
        role={undefined}
        dense
        button
        onClick={handleToggle}
        data-type={'all'}
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checkedAll}
            indeterminate={indeterminate}
          />
        </ListItemIcon>

        <ListItemSecondaryAction>
          {
            checked.length ? (
              <span>{`${checked.length} file currently selected`}</span>
            ) : (
              <span>{`${data.length} files`}</span>
            )
          }
        </ListItemSecondaryAction>
      </ListItem>
      {data.map((item, key) => {
        const labelId = `checkbox-list-label-${item}`;
        return (
          <ListItem
            key={item}
            role={undefined}
            dense
            button
            onClick={handleToggle}
            data-key={key}
            data-type={'single'}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(key) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={item && item.fileName} />
            <ListItemSecondaryAction>
              <span>{item && item.type}</span>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  ) : <Fragment />
}

ListFileUpload.propTypes = {
  data: arrayOf(
    shape({
      fileName: string,
      type: string
    })
  )
}
export default ListFileUpload;