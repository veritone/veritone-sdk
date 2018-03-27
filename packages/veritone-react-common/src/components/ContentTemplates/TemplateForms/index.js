import React from 'react';
import { has } from 'lodash';

import {
  any, 
  arrayOf, 
  objectOf,
  func
} from 'prop-types';

import TextField from 'material-ui/TextField';

import FormCard from 'components/ContentTemplates/FormCard';

import styles from './styles.scss';

//TODO: make most recently added content template appear at the top
export default class TemplateForms extends React.Component {
  static propTypes = {
    schemas: objectOf(any).isRequired,
    removeSchemaCallback: func.isRequired,
    returnDataCallback: func.isRequired
  };
  static defaultProps = {};

  state = {
    schemas: {}, // object key = schema guid and value is the schema object
  };

  componentWillMount = () => {
    this.setState({
      schemas: this.props.schemas
    });
  };

  handleRemoveForm = (schemaId) => {
    this.props.removeSchemaCallback(schemaId);
  };

  handleFieldChange = (schemaId, fieldId, value) => {
    this.setState({
      schemas: {
        ...this.state.schemas,
        [schemaId]: {
          ...this.state.schemas[schemaId],
          data: {
            ...this.state.schemas[schemaId].data,
            [fieldId]: value
          }
        }
      }
    }, () => this.props.returnDataCallback(this.state.schemas));
  };


  formBuilder = () => {
    let elements = [];
    return Object.keys(this.props.schemas).map((schemaId, index) => {
      let schema = this.props.schemas[schemaId].definition.properties;
      let name = this.props.schemas[schemaId].dataRegistry.name;
      let data = this.state.schemas[schemaId].data;

      let elements = Object.keys(schema).map((fieldId, index2) => {
        let field = schema[fieldId];
        return (<BuildFormElements 
                  fieldId={fieldId} 
                  schemaId={schemaId} 
                  type={field.type} 
                  value={this.state.schemas[schemaId].data[fieldId]} 
                  title={field.title ? field.title : fieldId} 
                  onChange={this.handleFieldChange} 
                  key={index2}/>);
      });
      return <FormCard fields={elements} name={name} id={schemaId} removeCallback={this.handleRemoveForm} key={index}/>;
    });
  };

  render() {
    return (
      <div className={styles.formsContainer}>
        {this.formBuilder()}
      </div>
    );
  };
}


function BuildFormElements({fieldId, schemaId, type, title, value, required, onChange, error }) {
  if (!required) {
    required = false;
  }
  const handleFieldChange = (schemaId, fieldId) => (event) => {
    return onChange(schemaId, fieldId, event.target.value);
  }
  let element;
  if (type.includes('string')) {
    element = (
      <TextField
        className={styles.textFieldExtra}
        type={fieldId.toLowerCase().includes('password') ? 'password': 'text'}
        fullWidth
        margin='dense'
        label={title}
        value={value}
        error={error}
        key={fieldId}
        onChange={handleFieldChange(schemaId, fieldId)}
      />
    );
  } else if (type.includes('number') || type.includes('integer')) {
    element = (
      <TextField
        className={styles.textFieldExtra}
        type={'number'}
        fullWidth
        margin='dense'
        label={title}
        value={value}
        error={error}
        key={fieldId}
        onChange={handleFieldChange(schemaId, fieldId)}
      />
    );
  }
  return React.cloneElement(element, {required: required});
}