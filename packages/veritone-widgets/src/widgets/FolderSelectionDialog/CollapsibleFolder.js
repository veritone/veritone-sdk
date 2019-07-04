import React from 'react';
// import { noop, get } from 'lodash';
import { objectOf, arrayOf, object, any } from 'prop-types';
// import { connect } from 'react-redux';
// import { withPropsOnChange } from 'recompose';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import FolderIcon from '@material-ui/icons/Folder';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import ListItemText from '@material-ui/core/ListItemText';
import FolderList from './FolderList';
import Collapse from '@material-ui/core/Collapse';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
// import styles from './styles.scss';


//import * as filePickerModule from '../../redux/modules/filePicker';
// import { guid } from '../../shared/util';

// import { yellow } from '@material-ui/core/colors';


export default class CollapsibleFolder extends React.Component {
  static propTypes = {
    records: arrayOf(object),
    folder: objectOf(any)
  };

  state = { open: false }
 
  handleClick = () => {
    this.setState((prevState) => ({open : !prevState.open}))
    const { folder } = this.props;
    console.log(folder)
  }

  render() {
   
    const { folder, records } = this.props;
 
    return (
      <List disablePadding>
        <ListItem button onClick={this.handleClick}>
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
          <ListItemIcon>
            <FolderIcon style ={{color: "#F0C56A"}}/>
          </ListItemIcon>
        <ListItemText primary={folder.name} />
        
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <div style={{paddingLeft: "25px"}}>
            <FolderList  list={records}/>
          </div>
        </Collapse>
      </List>
    );
  }
}


