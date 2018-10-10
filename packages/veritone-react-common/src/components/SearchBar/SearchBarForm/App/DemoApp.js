import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import { object } from '@storybook/addon-knobs/react';

import SearchBarContainer  from '../containers/SearchBarContainer';
import { CSPToSearchParameters } from '../../parser';
import SearchParameters from '../../';

import { engineCategories } from '../EngineModelInfo';


const styles = theme => ({
  typography: {
    margin: theme.spacing.unit * 2
  }
});

class DemoApp extends React.Component {

  constructor(props){
    super(props)
    console.log('engineCategories ', engineCategories);
}

  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleClose = () => {
    console.log('handleClose');
    this.setState({
      anchorEl: null
    });
  };

  handleAdd = word => {
    if (word){
      console.log('[DemoApp.js] handleAdd: ' + word.state.search);
    } else {
      console.log('[DemoApp.js] handleAdd: empty or undefined');
    }
  };


  render() {
    //const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    const csp = {
      'and(': [
        {
          state: { search: 'Lakers', language: 'en' },
          engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
        },
        {
          or: [
            {
              state: { search: 'Kobe', language: 'en' },
              engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
            }
          ]
        }
      ]
    };

    const searchParameters = CSPToSearchParameters(object('CSP', csp));

    return (
      <div>
        <SearchParameters parameters={searchParameters} />;
        <Button
          aria-owns={open ? 'simple-popper' : null}
          aria-haspopup="true"
          variant="contained"
          onClick={this.handleClick}
        >
          Open Search
        </Button>
        <Popover
          id="simple-popper"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}>
            <SearchBarContainer 
              engineCategories={engineCategories }
              onClose={this.handleClose}
              onAdd={this.handleAdd}
            />
        </Popover>
      </div>
    );
  }
}


export default withStyles(styles)(DemoApp);
