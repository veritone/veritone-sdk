import React from 'react';
import { object, func, string } from 'prop-types';

import { isEmpty } from 'lodash';

import Button from '@material-ui/core/Button';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';

import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { HorizontalScroll } from 'veritone-react-common';
import { SearchBar } from 'veritone-react-common';

class SaveSearch extends React.Component {
  static propTypes = {
    csp: object,
    defaultProfileName: string,
    onSave: func,
    onCancel: func
  };

  state = {
    shareWithOrg: false,
    profileName: this.props.defaultProfileName,
    blankProfileName: false
  };

  toggleShareWithOrg = (evt, checked) => {
    this.setState({shareWithOrg: checked});
  }

  onChangeProfileName = (evt) => {
    this.setState({profileName: evt.target.value, blankProfileName: isEmpty(evt.target.value)});
  }

  onSaveProfile = async (evt) => {
    if(isEmpty(this.state.profileName)) {
      this.setState({
        blankProfileName: true
      });
    } else {
      return await this.props.onSave({csp: this.props.csp, name: this.state.profileName, sharedWithOrganization: this.state.shareWithOrg});
    }
  }

  render() {
    return (
      <Card>
        <CardHeader
          action={
            <IconButton onClick={ this.props.onCancel } data-veritone-element="cancel_save_profile">
              <CloseIcon />
            </IconButton>
          }
          title="Save Search Profile"
          subheader="Create a saved search profile to efficiently run searches you frequently perform."
        />
        <CardContent>
          <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="stretch"
            spacing={24}
          >
            <Grid item>
              <TextField
                inputProps={ {
                  'data-veritone-element': "save_search_profile_name"
                } }
                value={this.state.profileName}
                onChange={this.onChangeProfileName}
                placeholder="Enter Search Profile Name"
                fullWidth
                margin="normal"
                error={this.state.blankProfileName}
              />
            </Grid>
            <Grid item style={{ width: '100%', display: 'flex' }}>
              <Grid
                container
                direction="column"
                justify="space-between"
                alignItems="stretch"
                spacing={16}
              >
                <Grid item>
                  <Typography variant="subheading" color="textSecondary">
                    Your Search Query
                  </Typography>
                </Grid>
                <Grid item>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <HorizontalScroll
                      leftScrollButton={
                        <IconButton>
                          <KeyboardArrowLeft />
                        </IconButton>
                      }
                      rightScrollButton={
                        <IconButton>
                          <KeyboardArrowRight />
                        </IconButton>
                      }
                    >
                      <SearchBar csp={this.props.csp} />
                    </HorizontalScroll>
                  </div>
                </Grid>
                <Grid item>
                  <Divider />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Switch
                        data-veritone-element="share_with_org"
                        checked={this.state.shareWithOrg}
                        onChange={this.toggleShareWithOrg}
                        value="checkedB"
                        color="primary"
                      />
                    }
                    label="Share with Org"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions style={{ float: 'right' }}>
          <Button color="primary" onClick={ this.props.onCancel } data-veritone-element='cancel_save_profile_button'>
            Cancel
          </Button>
          <Button color="primary" onClick={ this.onSaveProfile }  data-veritone-element='save_search'>
            Save
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default SaveSearch;
