import { truncate } from 'lodash';
import React from 'react';

import { string, func, shape } from 'prop-types';
import { OCRForm } from './OCRForm.js';


class OCRModal extends React.Component {

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
  
  // Event
  onChange = event => {

  };

  render() {
    return (
      <OCRForm 
        onCancel={ this.props.onCancel }
        //defaultValue={ this.props.modalState.search }
        onSubmit={ this.applyFilterIfValue }
        onChange={ this.onChange }
        inputValue={ this.state.filterValue }
      />
    );
  }
}

const getOCRLabel = modalState => {
  return {
    full: modalState.search,
    abbreviation: truncate(modalState.search, { length: 13 })
  };
};

export { getOCRLabel, OCRModal };
