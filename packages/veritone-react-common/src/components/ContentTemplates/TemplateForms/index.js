import React from 'react';
import {
  string,
  shape,
  any,
  arrayOf,
  objectOf,
  func,
  bool,
  number
} from 'prop-types';
import {
  isObject,
  compact,
  cloneDeep,
  isArray,
  includes,
  isUndefined,
  get,
  isNumber,
  toSafeInteger
} from 'lodash';

import SourceTypeField from 'components/SourceTypeField';
import FormCard from '../FormCard';
import styles from './styles.scss';

export default class TemplateForms extends React.Component {
  static propTypes = {
    templates: arrayOf(
      shape({
        id: string.isRequired,
        guid: string,
        name: string.isRequired,
        definition: objectOf(any),
        data: objectOf(any),
        dirtyState: objectOf(any)
      })
    ).isRequired,
    onTemplateDetailsChange: func.isRequired,
    onRemoveTemplate: func.isRequired,
    getFieldOptions: func,
    isReadOnly: bool,
    textInputMaxRows: number
  };
  static defaultProps = {};

  handleRemoveTemplate = templateId => {
    this.props.onRemoveTemplate(templateId);
  };

  handleSchemaFieldChange = (template, fieldId, type) => event => {
    const GEO_REGEX = /^-{0,1}[0-9]+\.[0-9]+, -{0,1}[0-9]+\.[0-9]+$/;
    let value;
    if (type === 'boolean') {
      value = event.target.checked;
    } else if (type === 'dateTime') {
      value = event;
    } else {
      value = event.target.value;
    }

    if (type === 'geoPoint' && !GEO_REGEX.test(value)) {
      value = '0.0, 0.0';
    }

    this.props.onTemplateDetailsChange(
      template.guid || template.id,
      fieldId,
      value
    );
  };

  handleFieldChange = (template, fieldId, type) => event => {
    const GEO_REGEX = /^-{0,1}[0-9]+\.[0-9]+, -{0,1}[0-9]+\.[0-9]+$/;
    // fieldId can be object/array prop accessors. eg. 'wind.windSpeed' or 'tags.0'
    let currentValue; // Maintain root object reference
    const fields = fieldId.split('.');
    const rootObject = fields[0];
    let eventValue;
    let pointer;

    if (type.includes('boolean')) {
      eventValue = event.target.checked;
    } else if (type.includes('dateTime')) {
      eventValue = event;
    } else {
      eventValue = event.target.value;
    }

    if (type.includes('geoPoint')) {
      if (!GEO_REGEX.test(eventValue)) {
        eventValue = '0.0, 0.0';
      }
    }

    if (fields.length > 1) {
      let objectTraverse = fields.slice(1 - fields.length);
      if (!!parseInt(objectTraverse[0]) || objectTraverse[0] === '0') {
        currentValue = cloneDeep(template.data[rootObject] || ['']);
      } else {
        currentValue = Object.assign({}, template.data[rootObject]);
      }
      pointer = currentValue;
      objectTraverse.forEach((field, index) => {
        // Initialize any undefined nested objects
        if (!isObject(pointer[field]) && index !== objectTraverse.length - 1) {
          pointer[field] = {};
          pointer = pointer[field];
        } else {
          if (event.target.value) {
            pointer[field] = this.parseType(type, eventValue);
          } else {
            delete pointer[field];
          }
        }
      });
    } else {
      currentValue = this.parseType(type, eventValue);
    }
    return this.props.onTemplateDetailsChange(
      template.guid || template.id,
      rootObject,
      currentValue
    );
  };

  handleArrayElementAdd = (template, fieldId) => $event => {
    let curArray = cloneDeep(template.data[fieldId]);
    if (isArray(curArray)) {
      curArray.push('');
      this.props.onTemplateDetailsChange(
        template.guid || template.id,
        fieldId,
        curArray
      );
    }
  };

  handleArrayElementRemove = (template, fieldId, index) => $event => {
    let curArray = cloneDeep(template.data[fieldId]);
    if (isArray(curArray)) {
      curArray.splice(index, 1);
      this.props.onTemplateDetailsChange(
        template.guid || template.id,
        fieldId,
        curArray
      );
    }
  };

  parseType = (type, value) => {
    let returnValue = value;
    if (type.includes('number')) {
      returnValue = parseFloat(value);
    } else if (type.includes('integer')) {
      returnValue = parseInt(value);
    } else if (type.includes('boolean')) {
      return value;
    } else if (type.includes('dateTime')) {
      returnValue = value.toISOString();
    }
    return returnValue || '';
  };

  render() {
    const { templates } = this.props;

    return (
      <div className={styles.formsContainer}>
        {templates.map(template => {
          const schemaProps = template.definition.properties;
          const requiredProps = template.definition.required || [];
          const formFields = Object.keys(schemaProps).map(schemaProp => {
            const { type } = schemaProps[schemaProp];
            const required = includes(requiredProps, schemaProp);
            const enums =
              !isUndefined(schemaProps[schemaProp].enum) &&
              get(schemaProps[schemaProp], 'enumNames.length') ===
                get(schemaProps[schemaProp], 'enum.length')
                ? schemaProps[schemaProp].enum.map((value, index) => {
                    return {
                      id: value,
                      name: schemaProps[schemaProp].enumNames[index]
                    };
                  })
                : schemaProps[schemaProp].enum;
            isArray(enums) && enums.sort((a, b) => (a.name < b.name ? -1 : 1));

            const fieldProps = {
              id: `${schemaProp}-${template.guid || template.id}`,
              key: `${template.id}${schemaProp}`,
              type: type.toLowerCase(),
              required,
              title: schemaProps[schemaProp].title || schemaProp,
              value: template.data[schemaProp] || '',
              onChange: this.handleSchemaFieldChange(template, schemaProp, type)
            }

            if (type === 'string' && !enums) {
              fieldProps.multiline = true,
              fieldProps.rowsMax = (
                this.props.textInputMaxRows
                && isNumber(this.props.textInputMaxRows)
                && this.props.textInputMaxRows >= 1
              ) ? toSafeInteger(this.props.textInputMaxRows) : 15
            }

            return (
              type && (
                <SourceTypeField
                  {...fieldProps}
                  options={enums}
                  peerSelection={
                    schemaProps[schemaProp].peerEnumKey
                      ? isArray(
                          template.data[schemaProps[schemaProp].peerEnumKey]
                        )
                        ? template.data[schemaProps[schemaProp].peerEnumKey]
                        : []
                      : undefined
                  }
                  query={
                    schemaProps[schemaProp].query ||
                    get(schemaProps[schemaProp], 'items.query')
                  }
                  getFieldOptions={this.props.getFieldOptions}
                  isDirty={get(template, ['dirtyState', schemaProp])}
                  isReadOnly={this.props.isReadOnly}
                />
              )
            );
          });

          return (
            <FormCard
              key={template.guid || template.id}
              id={template.guid || template.id}
              fields={compact(formFields)}
              name={template.name}
              remove={this.handleRemoveTemplate}
              isReadOnly={this.props.isReadOnly}
            />
          );
        })}
      </div>
    );
  }
}
