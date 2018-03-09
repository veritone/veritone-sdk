import React from 'react';
import { noop } from 'lodash';
import { bool, func, string, arrayOf, any } from 'prop-types';
import { connect } from 'react-redux';
import { MediaDetails } from 'veritone-react-common';
import { FullScreenDialog } from 'veritone-react-common';

import * as mediaDetailsModule from '../../redux/modules/mediaDetails';
import widget from '../../shared/widget';

@connect(
  (state, { _widgetId }) => ({
    engineCategories: mediaDetailsModule.engineCategories(state, _widgetId)
  }),
  {
    loadEngineCategoriesRequest: mediaDetailsModule.loadEngineCategoriesRequest
  },
  null,
  { withRef: true }
)
class MediaDetailsWidget extends React.Component {

  static propTypes = {
    _widgetId: string.isRequired,
    loadEngineCategoriesRequest: func,
    success: bool,
    error: bool,
    warning: bool,
    statusMessage: string,
    engineCategories: arrayOf(any)
  };

  loadEngineCategoriesCallback = noop;

  componentDidMount() {
    this.props.loadEngineCategoriesRequest(this.props._widgetId, this.props.mediaId);
  }

  render() {

    console.log('widget');
    console.log(this.props.engineCategories);

    // TODOs:
    // load Engine categories and pass down
    // load Engine outputs and pass down
    // load media metadata and pass down

    return (
      <FullScreenDialog open={true}>
        <MediaDetails {...this.props}></MediaDetails>
      </FullScreenDialog>
    );
  }
}

export default widget(MediaDetailsWidget);
