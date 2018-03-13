import React from 'react';
import { func, objectOf, any } from 'prop-types';

// import styles from '../styles.scss';

class AttributesFilter extends React.Component {
  static propTypes = {
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
