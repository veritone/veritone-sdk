import React from 'react';
import { func, string, bool, any, objectOf, shape, number, arrayOf } from 'prop-types';
import { get } from 'lodash';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';

import { ContentTemplate } from 'veritone-react-common';

import styles from './styles.scss';

import { connect } from 'react-redux';
import widget from '../../shared/widget';
import * as Actions from '../../redux/modules/folderCreation/actionCreators';

const widgetTitle = 'Create Folder';
const widgetDescription = 'Create folder within ${parentFolder}';
const labelCreate = 'Create';
const labelUpdate = 'Update';
const labelCancel = 'Cancel';
const labelFolderName = 'Folder Name';
const labelFolderDescription = 'Folder Description';
const txtFolderNameId = 'folderName';
const txtFolderDescriptionId = 'folderDescriptionId';

const connectWrapper = connect(
  state => ({
    folder: get(state, `${Actions.namespace}.folder.data`, {}),
    folderStatus: get(state, `${Actions.namespace}.folder.status`),
    schemas: get(state, `${Actions.namespace}.schemas.data`, {}),
    schemaStatus: get(state, `${Actions.namespace}.schemas.status`),
  }),
  { 
    loadSchemas: Actions.loadSchemas,
    loadFolder: Actions.loadFolder,
    createFolder: Actions.createFolder,
    updateFolder: Actions.updateFolder,
    initializeWidget: Actions.initializeWidget
  },
  null,
  { withRef: true }
);

@connectWrapper
class CreateFolderWidget extends React.Component {
  static propTypes = {
    fullscreen: bool,
    folderId: string,
    folder: shape({
      id: string.isRequired,
      name: string,
      description: string,
      orderIndex: number,
      parent: shape({
        id: string.isRequired,
        name: string
      }),
      contentTemplates: arrayOf(
        objectOf(any)
      )
    }),
    folderStatus: string,
    schemas: objectOf(
      shape({
        id: string,
        name: string.isRequired,
        status: string,
        definition: objectOf(any)
      })
    ),
    schemaStatus: string,
    rootFolderType: string.isRequired,
    parentFolderId: string.isRequired,
    parentFolderName: string.isRequired,
    loadSchemas: func.isRequired,
    loadFolder: func.isRequired,
    createFolder: func.isRequired,
    updateFolder: func.isRequired,
  };

  static defaultProps = {
  };

  state = {
    open: true,
    selectedTemplates: {}
  };

  componentDidMount() {
    this.fetchSchemas();
  }

  fetchSchemas = () => {
    this.props.loadSchemas();
  }

  fetchFolder = () => {
    const { folderId, loadFolder } = this.props;
    folderId && folderId.length > 0 && loadFolder && this.props.loadFolder(this.props.folderId);
  }

  createFolder = () => {
    const {parentFolderId, rootFolderType} = this.props;
    const folderName = this[`_${txtFolderNameId}`].value;
    const folderDescription = this[`_${txtFolderDescriptionId}`].value;
    this.props.createFolder(folderName, folderDescription, 0, parentFolderId, rootFolderType, null);
  }

  editFolder = () => {
    const { folderId, updateFolder } = this.props;
    const folderName = this[`_${txtFolderNameId}`].value;
    const folderDescription = this[`_${txtFolderDescriptionId}`].value;
    (folderId && updateFolder) && updateFolder(folderId, folderName, folderDescription, null);
  }

  handleSelectTemplate = (selectedSchemaId) => {
    
    const { schemas } = this.props;
    const newSelectedTemplate = {
      ...this.state.selectedTemplates,
      [selectedSchemaId]: {
        ...schemas[selectedSchemaId],
        data: {}  //TODO: update Data with initla data
      }
    }

    this.setState({
      selectedTemplates: newSelectedTemplate
    });

    /*
    const { templateData, initialTemplates } = this.props;
    const data = {};

    Object.keys(templateData[templateSchemaId].definition.properties).reduce(
      (fields, schemaDefProp) => {
        const value = get(initialTemplates, [templateSchemaId, 'data', schemaDefProp]);
        if (value) {
          data[schemaDefProp] = value;
        }
      },
      data
    );

    const newState = {
      contentTemplates: {
        ...this.state.contentTemplates,
        [templateSchemaId]: {
          ...templateData[templateSchemaId],
          data
        }
      }
    };

    this.setState(newState, () => {
      this.props.handleUpdateContentTemplates(newState.contentTemplates);
    });
    */
  }

  handleRemoveTemplate = (removedSchemaId) => {
    if (this.state.selectedTemplates[removedSchemaId]) {
      this.setState((prevState) => {
        const newSelectedTemplates = {...prevState.selectedTemplates};
        delete newSelectedTemplates[removedSchemaId];
        return {
          selectedTemplates: newSelectedTemplates
        }
      });
    }
  }

  handleTemplateChange = () => {
    //TODO: Handle Template Changed
  }

  closeDialog = () => {
    this.setState({
      open: false,
      selectedTemplates: {}
    });
  }

  handleClose = () => {
  }

  setRef = (target) => {
    (target) && (this[`_${target.id}`] = target);
  }

  render() {
    const {
      folder,
      schemas,
      folderId,
      fullscreen,
      parentFolderName
    } = this.props;

    const {
      open,
      selectedTemplates
    } = this.state;

    return (
      <div>
        <Dialog
          fullWidth
          maxWidth="md"
          fullscreen={fullscreen}
          open={open}
          onClose={this.handleClose}
          aria-labelledby="create-folder-dialog-title"
          aria-describedby="create-folder-dialog-description"
        >
          <DialogTitle id="create-folder-dialog-title">{widgetTitle}</DialogTitle>
          <DialogContent className={styles.createFolderDialog}>
            <DialogContentText id="create-folder-dialog-description">
              {widgetDescription.replace('${parentFolder}', parentFolderName)}
            </DialogContentText>
            <Input
              id={txtFolderNameId}
              inputRef={this.setRef}
              placeholder={labelFolderName}
              className={styles.folderTextInput}
              inputProps={{'aria-label': 'Description'}}
            />
            <Input
              id={txtFolderDescriptionId}
              inputRef={this.setRef}
              placeholder={labelFolderDescription}
              className={styles.folderTextInput}
              inputProps={{'aria-label': 'Description'}}
            />

            <div className={styles.contentTemplate}>
              <ContentTemplate
                templateData={schemas}
                selectedTemplateSchemas={selectedTemplates}
                onAddTemplate={this.handleSelectTemplate}
                onRemoveTemplate={this.handleRemoveTemplate}
                onInputChange={this.handleTemplateChange}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.closeDialog}>{labelCancel}</Button>
            {
              folderId ?
              <Button color="primary" onClick={this.updateFolder} autoFocus>{labelUpdate}</Button> 
              :
              <Button color="primary" onClick={this.createFolder} autoFocus>{labelCreate}</Button>
            }
          </DialogActions>
        </Dialog>
      </div>
    );
  };
}

export default widget(CreateFolderWidget);