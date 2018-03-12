import React from 'react';
import { func, objectOf, any } from 'prop-types';
import { capitalize } from 'lodash';
import Radio from 'material-ui/Radio';

import styles from '../styles.scss';

class AttributesFilter extends React.Component {
  static props = {
    filters: objectOf(any).isRequired,
    filterBy: func.isRequired
  };

  render() {
    return <div>AttributesFilter</div>;
  }
}

export default {
  label: 'Attributes',
  id: 'attributes',
  component: AttributesFilter
};
