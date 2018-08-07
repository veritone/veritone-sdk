import React from 'react';
import { func, bool, objectOf, arrayOf, any } from 'prop-types';
import { noop } from 'lodash';
import { submit } from 'redux-form';
import { connect } from 'react-redux';
import { ProgramInfo } from 'veritone-react-common';

import widget from '../../shared/widget';

@connect(null, { submit }, null, { withRef: true })
class ProgramInfoWidget extends React.Component {
  static propTypes = {
    sourceData: objectOf(any).isRequired,
    canShare: bool,
    organizations: arrayOf(any),
    canSelectAffiliateSources: bool,
    selectedAffiliateSources: arrayOf(any),
    affiliateSources: arrayOf(any),
    onProgramImageSave: func.isRequired,
    onProgramLiveImageSave: func.isRequired,
    submit: func.isRequired,
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
    return (
      <ProgramInfo {...this.props} onSubmit={this.state.submitCallback} />
    );
  }
}

export default widget(ProgramInfoWidget);
