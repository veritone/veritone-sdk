import React from 'react';
import { arrayOf, bool, objectOf, object } from 'prop-types';
import { SDOTable } from 'veritone-react-common';
import widget from '../../shared/widget';

class SDOTableWidget extends React.Component {
  static propTypes = {
    data: arrayOf(object).isRequired,
    schema: objectOf(object).isRequired,
    paginate: bool
  };

  static defaultProps = {
    paginate: false
  }

  render() {
    return (
      <SDOTable
        {...this.props}
      />
    );
  }
}

export default widget(SDOTableWidget);
