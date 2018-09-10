import { truncate } from 'lodash';
import React from 'react';
import { func, string, shape } from 'prop-types';

import { TagSearchForm } from './TagSearchForm';

class TagModal extends React.Component {

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
      modalState: { queryResults: [], 
        queryString: '', 
        exclude: false },
      onCancel: () => console.log('You clicked onCancel')
    };
  
    constructor(props, defaultProps) {
      super(props, defaultProps);
    }
  
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
        <TagSearchForm
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

const getTagLabel = modalState => {
  return {
    full: modalState.label,
    abbreviation: truncate(modalState.label, { length: 13 }),
    exclude: modalState.exclude
  };
};

export { getTagLabel, TagModal };
