import React from 'react';
import {
  string,
  object,
  arrayOf,
  shape,
  oneOfType,
  bool
} from 'prop-types';

import {SearchParameters} from './SearchParameters';



class SearchBar extends React.Component {
  static propTypes = {
    parameters: arrayOf(
      shape({
        id: string.isRequired,
        value: oneOfType([object, string]),
        conditionType: string.isRequired
      })
    ),
    disableTooltip: bool
  };

  static defaultProps = {
    disableTooltip: false
  };

  state = {
    hasError: false
  };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <div>Invalid searchQuery</div>;
    } else {
      return (
        <SearchParameters
          parameters={this.props.parameters}
          disableTooltip={this.props.disableTooltip}
        />
      );
    }
  }
}

export default SearchBar;
