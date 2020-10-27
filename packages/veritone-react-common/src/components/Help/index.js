import lodash from 'lodash';
import React, { Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import MessageIcon from '@material-ui/icons/Message';
import DescriptionIcon from '@material-ui/icons/Description';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/styles';
import { string, func, shape, any } from 'prop-types';

import styles from './styles';

export const helpPropTypes = {
  tooltipTitle: string,
  helpDocLabel: string,
  helpDocLink: string,
  helpDocCallback: func,
  supportLabel: string,
  supportCallback: func,
  onOpen: func,
  onClose: func,
  classes: shape({ any })
};

class Help extends React.Component {
  static propTypes = helpPropTypes;

  static defaultProps = {
    tooltipTitle: 'Help',
    helpDocLabel: 'View Help Docs',
    supportLabel: 'Chat With Support'
  };

  state = {
    anchorEl: null
  };

  showHelpWindow = event => {
    this.setState({
      anchorEl: event.currentTarget
    });

    this.props.onOpen && this.props.onOpen();
  };

  hideHelpWindow = event => {
    this.setState({ anchorEl: null });
    this.props.onClose && this.props.onClose();
  }

  openHelpDoc = event => {
    const {
      helpDocLink,
      helpDocCallback
    } = this.props;

    helpDocCallback && helpDocCallback();
    helpDocLink && window.open(helpDocLink, '_blank');
  }

  openChatWindow = event => {
    this.setState({ anchorEl: null });
    this.props.supportCallback && this.props.supportCallback();
    window.Intercom && window.Intercom('show');
  }

  render() {
    const {
      anchorEl
    } = this.state;

    const {
      tooltipTitle,
      helpDocLabel,
      supportLabel,
      helpDocLink,
      helpDocCallback,
      supportCallback,
      classes
    } = this.props;

    const hasHelpDoc = helpDocLink || helpDocCallback;
    const hasSupportChat = supportCallback || window.Intercom;
    const appVersion = lodash.get(window, 'config.appVersion');

    return (
      <div className={classes.help}>
        <Tooltip title={tooltipTitle || ''} disableFocusListener>
          <IconButton onClick={this.showHelpWindow} data-veritone-element="help-button">
            <HelpIcon htmlColor="white" />
          </IconButton>
        </Tooltip>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={this.hideHelpWindow}
          className={classes.popover}
        >
          <List disablePadding>
            {
              //Show Help Doc Link
              hasHelpDoc &&
              <ListItem
                button
                onClick={this.openHelpDoc}
                data-veritone-element="show-help-doc-button"
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary={helpDocLabel} classes={{ root: classes.helpItemText }} />
              </ListItem>
            }
            {
              //Show Chat With Support
              hasSupportChat &&
              <ListItem
                button
                onClick={this.openChatWindow}
                data-veritone-element="open-support-chat-button"
              >
                <ListItemIcon>
                  <MessageIcon />
                </ListItemIcon>
                <ListItemText primary={supportLabel} classes={{ root: classes.helpItemText }} />
              </ListItem>
            }
            {
              //Show App Version
              appVersion &&
              <Fragment>
                <Divider />
                <ListItem className={classes.versionWrapper}>
                  <ListItemText primary={appVersion} classes={{ primary: classes.versionText }} />
                </ListItem>
              </Fragment>
            }
          </List>
        </Popover>
      </div>
    );
  }
}

export default withStyles(styles)(Help);
