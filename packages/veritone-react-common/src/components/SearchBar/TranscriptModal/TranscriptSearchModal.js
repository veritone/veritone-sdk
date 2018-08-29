import React from 'react';
import { func, string, shape } from 'prop-types';

import TranscriptSearchForm from './TranscriptSearchForm';

export default class TranscriptSearchModal extends React.Component {
    
    // validating prop types
    static propTypes = {
      modalState: shape({
        search: string,
        language: string
      }),
      cancel: func
    };

    // creating default props
    static defaultProps = {
      modalState: {
        search: '',
        language: 'en'
      },
      cancel: () => console.log('You clicked cancel')
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
        return {
          search: this.state.filterValue ? this.state.filterValue.trim() : null,
          language: 'en'
        };
      }
    }
  
    render() {
      return (
        <TranscriptSearchForm
          cancel={this.props.cancel}
          defaultValue={
            (this.props.modalState && this.props.modalState.search) || ''
          }
          onChange={this.onChange}
          inputValue={this.state.filterValue}
        />
      );
    }
  }
  
