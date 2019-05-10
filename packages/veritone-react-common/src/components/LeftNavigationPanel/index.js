import React from 'react';
import { arrayOf, node, string, func, bool, shape } from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';

import classNames from 'classnames';

const styles = () => ({
  root: {
    width: '100%',
    maxWidth: 360,
    paddingLeft: 12,
    paddingRight: 16,
    backgroundColor: '#E8EAED',
    boxShadow: '0 15px 12px 0 rgba(0,0,0,0.22), 0 19px 38px 0 rgba(0,0,0,0.3)'
  },
  divider: {
    marginTop: 16,
    marginBottom: 20,
    marginLeft: 12,
    marginRight: 8
  },
  selected: {
    backgroundColor: 'rgba(33,150,243,0.12)'
  }
});


const LeftNavigationPanel = ({ pathList, classes }) => (
  <List component="nav" className={classes.root}>
    {
      pathList.map(({ id, icon, text, onClick, seperated, selected }) => (
        <React.Fragment key={text}>
          {seperated && <Divider className={classes.divider} />}
          <ListItem
            onClick={onClick}
            data-id={id}
            className={classNames({ [classes.selected]: selected })}
            button
          >
            <ListItemIcon>
              {icon}
            </ListItemIcon>
            <ListItemText>
              {text}
            </ListItemText>
          </ListItem>
        </React.Fragment>
      ))
    }
  </List>
);


LeftNavigationPanel.propTypes = {
  pathList: arrayOf(shape({
    id: string.isRequired,
    icon: node.isRequired,
    text: string.isRequired,
    onClick: func,
    seperated: bool,
    selected: bool
  })),
  classes: shape({
    root: string,
    divider: string,
    selected: string
  })
}


export default withStyles(styles)(LeftNavigationPanel);
