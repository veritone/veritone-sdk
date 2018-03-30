import React from 'react';
import {
  any,
  objectOf,
  func
} from 'prop-types';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

import styles from './styles.scss';

export default class TemplateList extends React.Component {
  static propTypes = {
    templates: objectOf(any).isRequired,
    selectedTemplates: objectOf(any), // an array of content template objects that had already been added to the source
    addOrRemoveTemplate: func.isRequired
  };

  addTemplate = (schemaId) => () => {
    this.props.addOrRemoveTemplate(schemaId);
  };

  removeTemplate = (schemaId) => () => {
    this.props.addOrRemoveTemplate(schemaId, true);
  };


  buildTemplateList = () => {
    const { templates, selectedTemplates } = this.props;

    return Object.keys(templates).map((schemaId, index) => {
      const isAdded = !!selectedTemplates[schemaId];

      return ( 
        <div className={styles.templateRow} key={index}>
          <div className={styles.name} style={isAdded ? {fontWeight: 500} : {}}>
            {templates[schemaId].name} 
          </div>
          {
            isAdded 
            ? <IconButton
                className={styles.trashIcon}
                onClick={this.removeTemplate(schemaId)}
                aria-label='trash'
              >
                <Icon className={'icon-trash'} />
              </IconButton>
            :
              <IconButton
                className={styles.trashIcon}
                onClick={this.addTemplate(schemaId)}
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
        {this.buildTemplateList()}
      </div>
    );
  };
}