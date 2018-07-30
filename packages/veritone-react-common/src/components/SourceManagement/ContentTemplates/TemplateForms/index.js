import React from 'react';
import { any, objectOf, func } from 'prop-types';
import { isObject, compact, cloneDeep, isArray } from 'lodash';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

import { SourceTypeField } from 'components/SourceManagement/SourceConfiguration/SchemaDrivenSelectForm';
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
        currentValue = cloneDeep(
          this.props.templates[schemaId].data[rootObject] || ['']
        );
      } else {
        currentValue = Object.assign(
          {},
          this.props.templates[schemaId].data[rootObject]
        );
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
      schemaId,
      rootObject,
      currentValue
    );
  };

  handleArrayElementAdd = (schemaId, fieldId) => $event => {
    let curArray = cloneDeep(this.props.templates[schemaId].data[fieldId]);
    if (isArray(curArray)) {
      curArray.push('');
      this.props.onTemplateDetailsChange(schemaId, fieldId, curArray);
    }
  };

  handleArrayElementRemove = (schemaId, fieldId, index) => $event => {
    let curArray = cloneDeep(this.props.templates[schemaId].data[fieldId]);
    if (isArray(curArray)) {
      curArray.splice(index, 1);
      this.props.onTemplateDetailsChange(schemaId, fieldId, curArray);
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
        {Object.keys(templates).map((schemaId, index) => {
          const schemaProps = templates[schemaId].definition.properties;
          const formFields = Object.keys(schemaProps).map(
            (schemaProp, propIdx) => {
              const { type, items } = schemaProps[schemaProp];

              return (
                type && (
                  <BuildFormElements
                    fieldId={`${schemaProp}-${schemaId}`}
                    schemaId={schemaId}
                    schemaProp={schemaProp}
                    type={type}
                    items={items}
                    value={templates[schemaId].data[schemaProp]}
                    title={schemaProps[schemaProp].title || schemaProp}
                    objectProperties={schemaProps[schemaProp].properties}
                    onChange={this.handleFieldChange}
                    handleArrayElementAdd={this.handleArrayElementAdd}
                    handleArrayElementRemove={this.handleArrayElementRemove}
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
  schemaProp,
  type,
  items,
  title,
  value,
  objectProperties,
  onChange,
  depth = 0,
  handleArrayElementAdd,
  handleArrayElementRemove,
  ...rest
}) {
  if (!type) {
    return undefined;
  }

  let element;

  if (!type.includes('object') && !type.includes('array')) {
    element = (
      <SourceTypeField
        id={fieldId}
        type={type}
        title={title}
        value={value || ''}
        onChange={onChange(schemaId, schemaProp, type)}
        {...rest}
      />
    );
  }

  if (type.includes('array')) {
    element = (value || ['']).map((elem, index) => {
      return (
        <div
          key={`${schemaProp}.${'containter' + index}`}
          className={styles.arrayRow}
        >
          <BuildFormElements
            {...rest}
            fieldId={`${fieldId}.${index}`}
            schemaId={schemaId}
            schemaProp={`${schemaProp}.${index}`}
            type={items.type}
            value={elem}
            title={`${items.title} ${index + 1}`}
            objectProperties={items.properties}
            depth={depth + 1}
            onChange={onChange}
            key={`${schemaProp}.${'buildform' + index}`}
          />
          {isArray(value) && value.length > 1 ? (
            <div className={styles.arrayRemove}>
              <IconButton
                disableRipple
                className={styles.noHover}
                onClick={handleArrayElementRemove(schemaId, schemaProp, index)}
              >
                <Icon className={'icon-trash'} />
              </IconButton>
            </div>
          ) : null}
        </div>
      );
    });
    element = (
      <div className={styles.insetSection}>
        <span>{title}</span>
        {element}
        <div className={styles.arrayAdd}>
          <IconButton
            className={styles.noHover}
            disableRipple
            onClick={handleArrayElementAdd(schemaId, schemaProp)}
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>
    );
  }

  if (type.includes('object') && objectProperties) {
    element = Object.keys(objectProperties).map(objProp => {
      return (
        <BuildFormElements
          {...rest}
          fieldId={`${fieldId}.${objProp}`}
          schemaId={schemaId}
          schemaProp={`${schemaProp}.${objProp}`}
          type={objectProperties[objProp].type}
          value={(value && value[objProp]) || ''}
          title={objectProperties[objProp].title || objProp}
          objectProperties={objectProperties[objProp].properties}
          depth={depth + 1}
          onChange={onChange}
          key={objProp}
        />
      );
    });
    element = (
      <div className={styles.insetSection}>
        <span>{title}</span>
        {element}
      </div>
    );
  }

  if (depth) {
    element = <div style={{ paddingLeft: depth * 10 }}>{element}</div>;
  }

  return element;
}
