import React from 'react';
import { any, objectOf, func } from 'prop-types';

import { isObject, compact } from 'lodash';

import TextField from 'material-ui/TextField';
import { FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import FormCard from '../FormCard';
import styles from './styles.scss';

export default class TemplateForms extends React.Component {
  static propTypes = {
    templates: objectOf(any).isRequired,
    onTemplateDetailsChange: func.isRequired,
    onRemoveTemplate: func.isRequired
  };
  static defaultProps = {};

  handleRemoveTemplate = schemaId => {
    this.props.onRemoveTemplate(schemaId, true);
  };

  handleFieldChange = (schemaId, fieldId, type) => event => {
    // fieldId can be object prop accessors. eg. 'wind.windSpeed' or 'wind.windDegree'
    let currentValue; // Maintain root object reference
    let fields = fieldId.split('.');
    let rootObject = fields[0];
    let pointer;
    if (fields.length > 1) {
      let objectTraverse = fields.slice(1 - fields.length);
      currentValue = Object.assign(
        {},
        this.props.templates[schemaId].data[rootObject]
      );
      pointer = currentValue;
      objectTraverse.forEach((field, index) => {
        // Initialize any undefined nested objects
        if (!isObject(pointer[field]) && index !== objectTraverse.length - 1) {
          pointer[field] = {};
          pointer = pointer[field];
        } else {
          if (event.target.value) {
            pointer[field] = this.parseType(type, event.target.value);
          } else {
            delete pointer[field];
          }
        }
      });
    } else {
      currentValue = this.parseType(type, event.target.value);
    }
    return this.props.onTemplateDetailsChange(
      schemaId,
      rootObject,
      currentValue
    );
  };

  parseType = (type, value) => {
    if (type.includes('number')) {
      return parseFloat(value);
    } else if (type.includes('integer')) {
      return parseInt(value);
    } else if (type.includes('boolean')) {
      return value === 'true';
    }
    return value;
  };

  render() {
    const { templates } = this.props;

    return (
      <div className={styles.formsContainer}>
        {Object.keys(templates).map((schemaId, index) => {
          const schemaProps = templates[schemaId].definition.properties;
          const formFields = Object.keys(schemaProps).map(
            (schemaProp, propIdx) => {
              console.log('type:', schemaProps[schemaProp].type);
              const type = schemaProps[schemaProp].type;

              return (
                type && (
                  <BuildFormElements
                    fieldId={schemaProp}
                    schemaId={schemaId}
                    // type={schemaProps[schemaProp].type}
                    type={type}
                    value={templates[schemaId].data[schemaProp]}
                    title={schemaProps[schemaProp].title || schemaProp}
                    objectProperties={schemaProps[schemaProp].properties}
                    onChange={this.handleFieldChange}
                    key={schemaProp}
                  />
                )
              );
            }
          );

          return (
            <FormCard
              key={schemaId}
              id={schemaId}
              fields={compact(formFields)}
              name={templates[schemaId].name}
              remove={this.handleRemoveTemplate}
            />
          );
        })}
      </div>
    );
  }
}

function BuildFormElements({
  fieldId,
  schemaId,
  type,
  title,
  value,
  required,
  onChange,
  error,
  objectProperties,
  depth = 0
}) {
  const additionalProps = {};
  if (required) {
    additionalProps.required = true;
  }

  let element;
  console.log('type:', type);
  if (!type) {
    return undefined;
  }

  if (type.includes('string')) {
    element = (
      <TextField
        className={styles.textFieldExtra}
        type={fieldId.toLowerCase().includes('password') ? 'password' : 'text'}
        fullWidth
        margin="dense"
        label={title}
        value={(value || '').toString()}
        error={error}
        key={fieldId}
        onChange={onChange(schemaId, fieldId, type)}
        {...additionalProps}
      />
    );
  } else if (type.includes('number') || type.includes('integer')) {
    element = (
      <TextField
        className={styles.textFieldExtra}
        type="number"
        fullWidth
        margin="dense"
        label={title}
        value={`${value}` || ''}
        error={error}
        key={fieldId}
        onChange={onChange(schemaId, fieldId, type)}
        {...additionalProps}
      />
    );
  } else if (type.includes('boolean')) {
    element = (
      <FormControlLabel
        label={title}
        control={
          <Checkbox
            onChange={onChange(schemaId, fieldId, type)}
            value={(!value).toString()}
            color="primary"
          />
        }
      />
    );
  } else if (type.includes('object') && objectProperties) {
    element = Object.keys(objectProperties).map(objProp => {
      return (
        <BuildFormElements
          fieldId={`${fieldId}.${objProp}`}
          schemaId={schemaId}
          type={objectProperties[objProp].type}
          value={(value && value[objProp]) || ''}
          title={objectProperties[objProp].title || objProp}
          objectProperties={objectProperties[objProp].properties}
          onChange={onChange}
          depth={depth + 1}
          key={objProp}
        />
      );
    });
    element = (
      <div>
        <span>{title}</span>
        {element}
      </div>
    );
  } else {
    return <div>{`Unsupported Type: ${type} for ${fieldId}`}</div>;
  }

  if (depth) {
    element = <div style={{ paddingLeft: depth * 10 }}>{element}</div>;
  }

  return element;
}
