import React from 'react';
import { has } from 'lodash';

import {
  any,
  objectOf,
  func
} from 'prop-types';

import TextField from 'material-ui/TextField';
import FormCard from 'components/SourceManagement/ContentTemplates/FormCard';
import styles from './styles.scss';

//TODO: make most recently added content template appear at the top
export default class TemplateForms extends React.Component {
  static propTypes = {
    schemas: objectOf(any).isRequired,
    removeSchema: func.isRequired,
    onFormChange: func.isRequired
  };
  static defaultProps = {};

  state = {
    schemas: {}, // object key = schema guid and value is the schema object
  };

  // componentWillMount = () => {
  //   this.setState({
  //     schemas: this.props.schemas
  //   });
  // };

  handleRemoveForm = (schemaId) => {
    this.props.removeSchema(schemaId);
  };

  handleFieldChange = (schemaId, fieldId, value) => {
    return this.props.onFormChange(schemaId, fieldId, value);
  };

  formBuilder = () => {
    const { schemas } = this.props;
    console.log('schemas:', schemas)
    // let elements = [];

    // return Object.keys(schemas).map((schemaId, index) => {
    return Object.keys(schemas).map((schemaId, index) => {
      const schemaProps = schemas[schemaId].definition.properties;
      // let name = schemas[schemaId].dataRegistry.name;

      // elements = Object.keys(schema).map((fieldId, index2) => {
      const formFields = Object.keys(schemaProps).map((schemaProp, index2) => {
        const field = schemaProps[schemaProp];

        return (
          <BuildFormElements 
            fieldId={schemaProp} 
            schemaId={schemaId} 
            type={field.type} 
            // value={this.state.schemas[schemaId].data[fieldId]} 
            value={schemas[schemaId].data[schemaProp]}
            title={field.title || schemaProp} 
            onChange={this.handleFieldChange} 
            key={index2}
          />
        );
      });
      
      return (
        <FormCard
          key={index}
          id={schemaId}
          fields={formFields}
          // name={schemas[schemaId].dataRegistry.name}
          name={schemas[schemaId].name}
          remove={this.handleRemoveForm}
        />
      );
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
  // if (!required) {
  //   required = false;
  // }
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

  return React.cloneElement(element, { required: !!required });
}