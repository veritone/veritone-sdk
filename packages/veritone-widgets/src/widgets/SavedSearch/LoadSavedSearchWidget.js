import React from 'react';
import { connect } from 'react-redux';
import { withPropsOnChange } from 'recompose';
import { string, oneOfType, object, func } from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import LoadSavedSearch from './LoadSavedSearch';

import widget from '../../shared/widget';

import * as savedSearchModule from '../../redux/modules/savedSearch';
import { modules } from 'veritone-redux-common';
const { user } = modules;

// save search profile widget
@connect(
  state => ({
    mySearchProfiles: savedSearchModule.mySearchProfiles(state),
    mySearchProfilesCount: savedSearchModule.mySearchProfilesCount(state),
    loadingMySearchProfiles: savedSearchModule.loadingMySearchProfiles(state),
    loadedMySearchProfiles: savedSearchModule.loadedMySearchProfiles(state),
    mySearchProfilesSortBy: savedSearchModule.mySearchProfilesSortBy(state),
    mySearchProfilesSortDirection: savedSearchModule.mySearchProfilesSortDirection(
      state
    ),
    mySearchProfilesFilterByName: savedSearchModule.mySearchProfilesFilterByName(
      state
    ),

    orgSearchProfiles: savedSearchModule.orgSearchProfiles(state),
    orgSearchProfilesCount: savedSearchModule.orgSearchProfilesCount(state),
    loadingOrgSearchProfiles: savedSearchModule.loadingOrgSearchProfiles(state),
    loadedOrgSearchProfiles: savedSearchModule.loadedOrgSearchProfiles(state),
    orgSearchProfilesSortBy: savedSearchModule.orgSearchProfilesSortBy(state),
    orgSearchProfilesSortDirection: savedSearchModule.orgSearchProfilesSortDirection(
      state
    ),
    orgSearchProfilesFilterByName: savedSearchModule.orgSearchProfilesFilterByName(
      state
    ),
    user: user.selectUser(state)
  }),
  {
    loadSearchProfiles: savedSearchModule.loadSearchProfiles,
    getSearchProfilesCount: savedSearchModule.getSearchProfilesCount,
    resetSearchProfiles: savedSearchModule.resetSearchProfiles,
    deleteSearchProfile: savedSearchModule.deleteSearchProfile,
    resetMySearchProfile: savedSearchModule.resetMySearchProfile,
    resetOrgSearchProfile: savedSearchModule.resetOrgSearchProfile
  },
  null,
  { withRef: true }
)
class LoadSavedSearchWidgetComponent extends React.Component {
  static propTypes = {
    onSelectSavedSearch: func,
    onClose: func
  };

  state = {
    confirmReplace: true,
    open: false
  };

  open = () => {
    this.props.resetSearchProfiles();
    this.setState({ open: true }, () => {
      this.props.getSearchProfilesCount();
      this.props.getSearchProfilesCount({ shared: true });
    });
  };

  close = () => {
    this.setState({ open: false },
      this.props.resetSearchProfiles);
  };

  loadMoreRows = ({ shared }) => ({ startIndex, stopIndex }) => {
    this.props.loadSearchProfiles({
      limit: stopIndex - startIndex + 1,
      offset: startIndex,
      shared
    });
  };

  render() {
    return (
      <Dialog
        open={this.state.open}
        fullWidth
        maxWidth={false}
        disableEnforceFocus
        PaperProps={{ style: { width: '100%', maxWidth: '75%' } }}
      >
        <LoadSavedSearch
          data-veritone-component="load_saved_search"
          data-uri={'new '}
          relativeSize={this.props.relativeSize}
          mySearchProfiles={this.props.mySearchProfiles}
          loadedMySearchProfiles={this.props.loadedMySearchProfiles}
          loadSearchProfiles={this.props.loadSearchProfiles}
          mySearchProfilesCount={this.props.mySearchProfilesCount}
          loadMoreMySearchProfiles={this.loadMoreRows({ shared: false })}
          mySearchProfilesSortBy={this.props.mySearchProfilesSortBy}
          mySearchProfilesSortDirection={
            this.props.mySearchProfilesSortDirection
          }
          resetMySearchProfiles={this.props.resetMySearchProfile}
          mySearchProfilesFilterByName={this.props.mySearchProfilesFilterByName}
          orgSearchProfiles={this.props.orgSearchProfiles}
          loadedOrgSearchProfiles={this.props.loadedOrgSearchProfiles}
          orgSearchProfilesCount={this.props.orgSearchProfilesCount}
          loadMoreOrgSearchProfiles={this.loadMoreRows({ shared: true })}
          orgSearchProfilesSortBy={this.props.orgSearchProfilesSortBy}
          orgSearchProfilesSortDirection={
            this.props.orgSearchProfilesSortDirection
          }
          orgSearchProfilesFilterByName={
            this.props.orgSearchProfilesFilterByName
          }
          resetOrgSearchProfiles={this.props.resetOrgSearchProfile}
          user={
            this.props.user
          }
          onClose={this.close}
          onSelectSavedSearch={this.props.onSelectSavedSearch}
          deleteSearchProfile={this.props.deleteSearchProfile}
          id={this.props._widgetId}
          resetSearchProfiles={this.props.resetSearchProfiles}
          {...this.props}
        />
      </Dialog>
    );
  }
}

const LoadSavedSearchWidget = widget(LoadSavedSearchWidgetComponent);

export default LoadSavedSearchWidget;
