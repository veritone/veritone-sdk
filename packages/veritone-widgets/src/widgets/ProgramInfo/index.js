import React from 'react';
import {
  func,
  bool,
  objectOf,
  arrayOf,
  any,
  shape,
  string,
  number
} from 'prop-types';
import { noop } from 'lodash';
import { submit } from 'redux-form';
import { connect } from 'react-redux';
import { ProgramInfo } from 'veritone-react-common';

import widget from '../../shared/widget';

@connect(null, { submit }, null, { withRef: true })
class ProgramInfoWidget extends React.Component {
  static propTypes = {
    program: shape({
      id: string.isRequired,
      name: string,
      imageUri: string,
      signedImageUri: string,
      liveImageUri: string,
      signedLiveImageUri: string,
      description: string,
      website: string,
      format: string,
      language: string,
      isNational: bool,
      acls: arrayOf(
        shape({
          organizationId: string.isRequired,
          permission: string.isRequired
        })
      ),
      isPublic: bool,
      affiliates: arrayOf(
        shape({
          id: string.isRequired,
          name: string.isRequired,
          schedule: objectOf(any).isRequired
        })
      )
    }),
    programFormats: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ),
    canShare: bool,
    organizations: arrayOf(
      shape({
        organizationId: string.isRequired,
        organizationName: string.isRequired
      })
    ),
    canEditAffiliates: bool,
    canBulkAddAffiliates: bool,
    affiliates: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ),
    relativeSize: number, // optional - used to scale text sizes from hosting app
    color: string,
    submit: func.isRequired
  };

  state = {
    submitCallback: noop
  };

  submit = (submitCallback = noop) => {
    this.setState(
      {
        submitCallback
      },
      () => this.props.submit('programInfo')
    );
  };

  render() {
    return <ProgramInfo {...this.props} onSubmit={this.state.submitCallback} />;
  }
}

export default widget(ProgramInfoWidget);
