import React from 'react';
import { has } from 'lodash';

import {
  any,
  objectOf,
  func
} from 'prop-types';

import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

import styles from './styles.scss';

//TODO: make most recently added content template appear at the top
export default class TemplateList extends React.Component {
  static propTypes = {
    templates: objectOf(any).isRequired,
    // initialTemplates: objectOf(any), // an array of content template objects that had already been added to the source
    addedSchemas: objectOf(any), // an array of content template objects that had already been added to the source
    addOrRemoveSchema: func.isRequired
  };
  static defaultProps = {};

  // state = {
  //   schemas: {}, // object key = schema guid and value is the schema object
  //   added: {}, // store an object of the schemas that have been added, key = schemaId
  // };

  // componentWillMount = () => {
  //   this.setState({
  //     schemas: this.props.templates,
  //     added: this.props.initialTemplates
  //   });
  // };
  addSchema = (schemaId) => () => {
    // let schemaCopy = {};
    // schemaCopy[schemaId] = this.state.schemas[schemaId];
    // this.setState({
    //   added: Object.assign({}, this.state.added, schemaCopy)
    // }, this.handleAddedOrRemoved);
    this.props.addOrRemoveSchema(schemaId);
  };

  removeSchema = (schemaId) => () => {
    this.props.addOrRemoveSchema(schemaId, true);
    // let schemaCopy = this.state.added;
    // delete schemaCopy[schemaId];
    // this.setState({
    //   added: schemaCopy
    // }, this.handleAddedOrRemoved);
  };


  buildSchemaList = () => {
    const { templates, addedSchemas } = this.props;
    // return Object.keys(this.state.schemas).map((schemaId, index) => {
    return Object.keys(templates).map((schemaId, index) => {
      // let isAdded = this.state.added[schemaId] ? true : false;
      const isAdded = !!addedSchemas[schemaId];

      return ( 
        <div className={styles.templateRow} key={index}>
          <div className={styles.name} style={isAdded ? {fontWeight: 500} : {}}>
            {/* {this.state.schemas[schemaId].dataRegistry.name}  */}
            {templates[schemaId].name} 
          </div>
          {
            isAdded 
            ? <IconButton
                className={styles.trashIcon}
                onClick={this.removeSchema(schemaId)}
                aria-label='trash'
              >
                <Icon className={'icon-trash'} />
              </IconButton>
            :
              <IconButton
                className={styles.trashIcon}
                onClick={this.addSchema(schemaId)}
                aria-label='add'
              >
                <Icon className={'icon-zoom-in'} />
              </IconButton>
          }
        </div>
      );
    });
  };

  render() {
    return (
      <div className={styles.listContainer}>
        <div className={styles.title}>
          Content Templates
        </div>
        <div className={styles.description}>
          These will be applied to all temporal data objects ingested through this source.
        </div>
        {this.buildSchemaList()}
      </div>
    );
  };
}