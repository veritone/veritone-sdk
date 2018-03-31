import React from 'react';
import {
  any,
  objectOf,
  func
} from 'prop-types';

import TextField from 'material-ui/TextField';
import FormCard from 'components/SourceManagement/ContentTemplates/FormCard';
import styles from './styles.scss';


export default class TemplateForms extends React.Component {
  static propTypes = {
    templates: objectOf(any).isRequired,
    onTemplateDetailsChange: func.isRequired,
    onRemoveTemplate: func.isRequired
  };
  static defaultProps = {};

  state = {
    templates: {}, // object key = schema guid and value is the schema object
  };

  handleRemoveTemplate = (schemaId) => {
    this.props.onRemoveTemplate(schemaId, true);
  };

  // handleFieldChange = (schemaId, fieldId, value) => {
  //   return this.props.onFormChange(schemaId, fieldId, value);
  // };

  formBuilder = () => {
    const { templates } = this.props;

    return Object.keys(templates).map((schemaId, index) => {
      const schemaProps = templates[schemaId].definition.properties;
      const formFields = Object.keys(schemaProps).map((schemaProp, index2) => {
        return (
          <BuildFormElements 
            fieldId={schemaProp} 
            schemaId={schemaId} 
            type={schemaProps[schemaProp].type} 
            value={templates[schemaId].data[schemaProp]}
            title={schemaProps[schemaProp].title || schemaProp} 
            // onChange={this.handleFieldChange} 
            onChange={this.props.onTemplateDetailsChange} 
            key={index2}
          />
        );
      });
      
      return (
        <FormCard
          key={index}
          id={schemaId}
          fields={formFields}
          name={templates[schemaId].name}
          remove={this.handleRemoveTemplate}
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
  const handleFieldChange = (schemaId, fieldId) => (event) => {
    return onChange(schemaId, fieldId, event.target.value);
  }

  const additionalProps = {};
  if (required) {
    additionalProps.required = true;
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
        {...additionalProps}
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
        {...additionalProps}        
      />
    );
  }

  return element;
}