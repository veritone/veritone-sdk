import { truncate } from 'lodash';

import React from 'react';
import { func, string, shape } from 'prop-types';
import { ObjectSearchForm } from './ObjectSearchForm';

class ObjectModal extends React.Component {

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
        <ObjectSearchForm
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

const getObjectLabel = modalState => {
  const truncatedLabel = truncate(modalState.label, { length: 13 });
  return {
    full:
      modalState.type === 'fullText'
        ? `CONTAINS: ${modalState.label}`
        : modalState.label,
    abbreviation:
      modalState.type === 'fullText'
        ? `CONTAINS: ${truncatedLabel}`
        : truncatedLabel,
    thumbnail: modalState.image,
    exclude: modalState.exclude
  };
};

export { getObjectLabel, ObjectModal };
