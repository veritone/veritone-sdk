import { includes } from 'lodash';

import React from 'react';
import { func, string, shape } from 'prop-types';


import { StructureDataSearchForm } from './StructureDataSearchForm';

class StructuredDataModal extends React.Component {

    // validating prop types
    static propTypes = {
      modalState: shape({
        search: string,
        language: string
      }),
      engineCategoryId: string,
      onCancel: func
    };

    // creating default props
    static defaultProps = {
      modalState: {
        search: '',
        language: 'en'
      },
      onCancel: () => console.log('You clicked onCancel')
    };
  
    state = {
      filterValue: null || this.props.modalState.search
    };
  
    onChange = event => {
      this.setState({
        filterValue: event.target.value
      });
    };
  
    returnValue() {
      if (!this.state.filterValue || this.state.filterValue.trim().length === 0) {
        return;
      } else {
        /*
            {
              state: { search: 'Kobe', language: 'en' },
              engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
            }
        */
        return  {
            state : {
            search: this.state.filterValue ? this.state.filterValue.trim() : null,
            language: 'en'
          },
          engineCategoryId: this.props.engineCategoryId
        }
        ;
      }
    }

  render() {
    return (
        <StructureDataSearchForm
          onCancel={this.props.onCancel}
          defaultValue={
            (this.props.modalState && this.props.modalState.search) || ''
          }
          onChange={this.onChange}
          inputValue={this.state.filterValue}
        />
    );
  }
}

const getStructuredDataLabel = modalState => {
  const OPERATOR_ABRV = {
    is: 'IS',
    is_not: 'IS NOT',
    gte: '>=',
    lte: '<=',
    gt: '>',
    lt: '<',
    contains: 'CONTAINS',
    not_contains: 'EXCLUDES',
    within: 'WITHIN',
    range: 'BETWEEN'
  };

  const getAbbreviation = modalState => {
    if (modalState.operator === 'range') {
      return `${modalState.field.split('.').slice(-1)[0]} ${
        OPERATOR_ABRV[modalState.operator]
      } (${modalState.value1},${modalState.value2})`;
    } else if (modalState.operator === 'within') {
      return `${Number(
        modalState.value1.distance.toFixed(0)
      )} meters of ${Number(modalState.value1.latitude.toFixed(2))}, ${Number(
        modalState.value1.longitude.toFixed(2)
      )}`;
    } else {
      return `${modalState.field.split('.').slice(-1)[0]} ${
        OPERATOR_ABRV[modalState.operator]
      } ${modalState.value1}`;
    }
  };
  return {
    full: getAbbreviation(modalState),
    abbreviation: getAbbreviation(modalState),
    exclude: includes(modalState.operator, 'not'),
    thumbnail: null
  };
};

export { getStructuredDataLabel, StructuredDataModal };
