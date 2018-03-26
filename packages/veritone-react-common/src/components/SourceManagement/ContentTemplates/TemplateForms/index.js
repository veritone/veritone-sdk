import React from 'react';

import {
  any, 
  arrayOf, 
  objectOf,
  func
} from 'prop-types';

import styles from './styles.scss';

//TODO: make most recently added content template appear at the top
export default class TemplateForms extends React.Component {
  static propTypes = {
    templates: arrayOf(any)

  };
  static defaultProps = {};

  state = {
    schemas: []
  };

  componentWillMount = () => {
    this.state.schemas = [
      {
        url: {
          type: 'string',
        },
        username: {
          type: 'string',
          title: 'User Name'
        },
        password: {
          type: 'string'
        }
      },
      {
        url: {
          type: 'string',
        },
        username: {
          type: 'string',
          title: 'User Name'
        },
        password: {
          type: 'string'
        },
        date: {
          type: 'date',
          title: 'Timestamp'
        }
      }
    ]
  }


  formBuilder = () => {
    this.state.schemas.forEach(schema => {
      Object.keys(schema).forEach(field => {
        <BuildFormElements id={field} type={this.state.schemas}/>
      })
    });
    return <div>haha</div>
  };

  render() {
    return (
      <div className={styles.formsContainer}>
        
      </div>
    );
  };
}


function BuildFormElements({id, type, value, onChange, title}) {
  return <div></div>;
}