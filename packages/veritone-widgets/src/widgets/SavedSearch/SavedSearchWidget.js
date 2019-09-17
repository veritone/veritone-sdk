import React from 'react';
import { connect } from 'react-redux';
import { string, oneOfType, object, func } from 'prop-types';

import Dialog from '@material-ui/core/Dialog';

import SaveSearch from './SaveSearch';
import ReplaceDialog from './SaveSearch/replace';

import widget from '../../shared/widget';

import * as savedSearchModule from '../../redux/modules/savedSearch';

// save search profile widget
@connect(
  state => ({
    isDuplicate: savedSearchModule.isDuplicate(state),
    duplicateProfileName: savedSearchModule.duplicateProfileName(state),
    duplicateProfileId: savedSearchModule.duplicateProfileId(state),
    duplicateProfileShared: savedSearchModule.duplicateProfileShared(state)
  }),
  {
    saveSearchProfile: savedSearchModule.saveSearchProfile,
    replaceSearchProfile: savedSearchModule.replaceSearchProfile,
    resetSaveSearch: savedSearchModule.resetSaveSearch
  },
  null,
  { withRef: true }
)
class SaveSearchWidgetComponent extends React.Component {
  static propTypes = {
    csp: object.isRequired,
    onClose: func
  };

  state = {
    open: false,
    confirmReplace: false
  };

  open = () => {
    this.setState({
      open: true
    });
  };

  close = () => {
    this.setState(
      {
        open: false,
        confirmReplace: false
      },
      this.props.resetSaveSearch
    );
  };

  replaceCSP = async () => {
    let success = await this.props.replaceSearchProfile({
      id: this.props.duplicateProfileId,
      csp: this.props.csp,
      name: this.props.duplicateProfileName,
      shared: this.props.duplciateProfileShared
    });
    if (success) {
      this.close();
    }
  };

  saveCSP = async ({ csp, name, sharedWithOrganization }) => {
    let success = await this.props.saveSearchProfile({
      csp,
      name,
      sharedWithOrganization
    });
    if (!success && this.props.isDuplicate) {
      this.setState({ confirmReplace: true });
    } else if (success) {
      this.close();
    }
  };

  hideReplaceDialog = evt => {
    this.setState({
      confirmReplace: false
    });
  };

  render() {
    if (this.state.confirmReplace) {
      return (
        <Dialog open={this.state.open}>
          <ReplaceDialog
            data-veritone-component="replace_saved_search"
            relativeSize={this.props.relativeSize}
            onClose={this.hideReplaceDialog}
            onReplace={this.replaceCSP}
            searchProfileName={this.props.duplicateProfileName || ''}
          />
        </Dialog>
      );
    } else {
      return (
        <Dialog
          open={this.state.open}
          fullWidth
          maxWidth={false}
          disableEnforceFocus
          PaperProps={{ style: { width: '100%', maxWidth: '65%' } }}
        >
          <SaveSearch
            data-veritone-component="save_search"
            relativeSize={this.props.relativeSize}
            defaultProfileName={this.props.duplicateProfileName || ''}
            onCancel={this.close}
            onSave={this.saveCSP}
            id={this.props._widgetId}
            {...this.props}
            csp={this.props.csp}
          />
        </Dialog>
      );
    }
  }
}

const SaveSearchWidget = widget(SaveSearchWidgetComponent);

export { SaveSearchWidgetComponent as SaveSearch };
export default SaveSearchWidget;
