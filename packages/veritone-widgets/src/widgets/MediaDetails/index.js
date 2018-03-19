import React from 'react';
import { noop } from 'lodash';
import { bool, func, object, string, arrayOf, any } from 'prop-types';
import { connect } from 'react-redux';
import { MediaDetails } from 'veritone-react-common';
import { FullScreenDialog } from 'veritone-react-common';

import * as mediaDetailsModule from '../../redux/modules/mediaDetails';
import widget from '../../shared/widget';

@connect(
  (state, { _widgetId }) => ({
    engineCategories: mediaDetailsModule.engineCategories(state, _widgetId),
    tdo: mediaDetailsModule.tdo(state, _widgetId)
  }),
  {
    loadEngineCategoriesRequest: mediaDetailsModule.loadEngineCategoriesRequest,
    loadTdoRequest: mediaDetailsModule.loadTdoRequest
  },
  null,
  { withRef: true }
)
class MediaDetailsWidget extends React.Component {

  static propTypes = {
    _widgetId: string.isRequired,
    loadEngineCategoriesRequest: func,
    loadMediaMetadataRequest: func,
    success: bool,
    error: bool,
    warning: bool,
    statusMessage: string,
    engineCategories: arrayOf(any),
    tdo: object
  };

  componentDidMount() {
    this.props.loadEngineCategoriesRequest(this.props._widgetId, this.props.mediaId);
    this.props.loadTdoRequest(this.props._widgetId, this.props.mediaId);
  }

  render() {
    return (
      <FullScreenDialog open={true}>
        <MediaDetails {...this.props}></MediaDetails>
      </FullScreenDialog>
    );
  }
}

export default widget(MediaDetailsWidget);
