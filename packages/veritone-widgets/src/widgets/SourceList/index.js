import React from 'react';
import { arrayOf, object, func, bool } from 'prop-types';
import { SourceNullState, SourceTileView } from 'veritone-react-common';
import { omit } from 'lodash';

import widget from '../../shared/widget';

class SourceListWidget extends React.Component {
  static propTypes = {
    sources: arrayOf(object).isRequired,
    onSelectMenuItem: func.isRequired,
    onCreateSource: func.isRequired,
    paginate: bool
  };

  render() {
    const viewProps = omit(this.props, ['onCreateSource']);

    return (
      !this.props.sources.length
        ? <SourceNullState onClick={this.props.onCreateSource} />
        : <SourceTileView
            {...viewProps}
          />
    );
  }
}

export default widget(SourceListWidget);
