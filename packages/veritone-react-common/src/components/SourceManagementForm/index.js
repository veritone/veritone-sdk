import React from 'react';
import { arrayOf, objectOf, any, func, string, shape, bool } from 'prop-types';
import { pick, has, get, noop, reject, cloneDeep, isUndefined } from 'lodash';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import FullScreenDialog from 'components/FullScreenDialog';
import ModalHeader from 'components/ModalHeader';
import SourceConfiguration from 'components/SourceConfiguration';
import ContentTemplates from 'components/ContentTemplates';
import SharingConfiguration from 'components/SharingConfiguration';
import { guid } from 'helpers/guid';

import styles from './styles.scss';

export default class SourceManagementForm extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired,
        sourceSchema: shape({
          definition: shape({
            properties: shape({
              type: string
            })
          })
        })
      })
    ).isRequired,
    templateData: objectOf(
      shape({
        id: string,
        name: string.isRequired,
        status: string,
        definition: objectOf(any)
      })
    ).isRequired,
    source: shape({
      name: string,
      sourceType: objectOf(any),
      details: objectOf(any),
      thumbnailUrl: string
    }),
    initialTemplates: arrayOf(
      shape({
        id: string,
        name: string.isRequired,
        status: string,
        definition: objectOf(any),
        data: objectOf(any)
      })
    ),
    isReadOnly: bool,
    canShare: bool,
    // eslint-disable-next-line react/no-unused-prop-types
    organizations: arrayOf(
      shape({
        // used on component mount to populate acls
        id: string.isRequired,
        name: string.isRequired
      })
    ),
    onSubmit: func.isRequired,
    onClose: func,
    getFieldOptions: func.isRequired,
    open: bool,
    appConfig: shape({
      boxClientId: string,
      dropboxClientId: string,
      googleDriveClientId: string
    })
  };

  static defaultProps = {
    initialTemplates: [],
    onClose: noop
  };

  state = {
    selectedSource: null,
    sourceConfig: {
      sourceTypeId: '',
      name: '',
      thumbnailUrl: '',
      details: {},
      thumbnailFile: null
    },
    formDirtyStates: {},
    contentTemplates: [],
    organizations: {},
    activeTab: 0,
    openDialog: true
  };

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillMount() {
    const { sourceTypes } = this.props;

    const newState = {
      contentTemplates: [...this.props.initialTemplates]
    };
    newState.contentTemplates.forEach(template => (template.guid = guid()));
    newState.organizations = {};
    get(this.props, 'organizations', []).forEach(
      organization => (newState.organizations[organization.id] = organization)
    );

    if (has(this.props, 'open')) {
      newState.openDialog = this.props.open;
    }
    if (this.props.source) {
      // if editing a source, initialize the defaults
      newState.sourceConfig = {
        ...pick(this.props.source, ['name', 'thumbnailUrl', 'details']),
        sourceTypeId: this.props.source.sourceType.id
      };
      if (this.props.canShare) {
        newState.share = {
          isPublic: this.props.source.isPublic
        };
        get(this.props.source, 'collaborators.records', []).forEach(
          collaborator => {
            if (newState.organizations[collaborator.organizationId]) {
              newState.organizations[collaborator.organizationId].permission =
                collaborator.permission;
            } else {
              newState.organizations[collaborator.organizationId] = {
                id: collaborator.organizationId,
                name: collaborator.organizationId,
                permission: collaborator.permission
              };
            }
          }
        );
      }
    } else {
      // If there is no source, then just pick the first available sourceType
      const fieldValues = {};
      const sourceTypeIdx = 0;
      const properties = get(sourceTypes, [
        sourceTypeIdx,
        'sourceSchema',
        'definition',
        'properties'
      ]);

      if (properties) {
        Object.keys(properties).forEach(field => {
          fieldValues[field] = '';
        });
      }

      newState.sourceConfig = {
        ...this.state.sourceConfig,
        sourceTypeId: sourceTypes[sourceTypeIdx].id,
        details: {
          ...fieldValues
        }
      };
      if (this.props.canShare) {
        newState.share = {
          isPublic: false,
          acls: []
        };
      }
    }

    return this.setState(newState);
  }

  handleCloseDialog = () => {
    return this.setState({ openDialog: false }, () => {
      this.props.onClose();
    });
  };

  handleChangeTab = (e, tabIdx) => {
    return this.setState({ activeTab: tabIdx });
  };

  saveConfiguration = config => {
    return this.setState(prevState => ({
      sourceConfig: {
        ...prevState.sourceConfig,
        ...config
      }
    }));
  };

  addToTemplateList = templateSchemaId => {
    const { templateData } = this.props;
    const data = {};
    Object.keys(templateData[templateSchemaId].definition.properties).reduce(
      (fields, schemaDefProp) => {
        data[schemaDefProp] = data[schemaDefProp];
      },
      data
    );
    this.setState(prevState => ({
      contentTemplates: [
        {
          ...templateData[templateSchemaId],
          data,
          guid: guid()
        },
        ...prevState.contentTemplates
      ]
    }));
  };

  removeFromTemplateList = templateId => {
    return this.setState(prevState => {
      return {
        contentTemplates: reject([...prevState.contentTemplates], {
          guid: templateId
        })
      };
    });
  };

  updateTemplateDetails = (templateId, fieldId, value) => {
    this.setState(prevState => {
      if (
        prevState.contentTemplates.some(
          template => template.guid === templateId
        )
      ) {
        const contentTemplates = [...prevState.contentTemplates];
        const templateIndex = contentTemplates.findIndex(
          template => template.guid === templateId
        );
        contentTemplates[templateIndex] = {
          ...contentTemplates[templateIndex],
          data: {
            ...contentTemplates[templateIndex].data,
            [fieldId]: value
          },
          dirtyState: {
            ...contentTemplates[templateIndex].dirtyState,
            [fieldId]: true
          }
        };
        return { contentTemplates };
      }
    });
  };

  handleAclsChange = modifiedAcls => {
    this.setState(prevState => {
      return {
        organizations: {
          ...prevState.organizations,
          ...modifiedAcls
        }
      };
    });
  };

  handleIsPublicChange = isPublic => {
    this.setState(prevState => {
      return {
        share: {
          ...prevState.share,
          isPublic
        }
      };
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    let isValidForm = true;
    let resultTemplates = [];
    this.setState(
      prevState => {
        const sourceTypeId = prevState.sourceConfig.sourceTypeId;
        const selectedSourceType = this.props.sourceTypes.find(
          sourceType => sourceType.id === sourceTypeId
        );
        const schemaProps = get(
          selectedSourceType,
          'sourceSchema.definition.properties'
        );
        const formDirtyStates = Object.keys(schemaProps || []).reduce(
          (acc, curVal) => {
            acc[curVal] = true;
            return acc;
          },
          {}
        );
        // Determine if any required fields are undefined and prevent submission if invalid
        const formValues = prevState.sourceConfig.details;
        const requiredFields =
          get(selectedSourceType, 'sourceSchema.definition.required') || [];
        requiredFields.forEach(requiredField => {
          const value = formValues[requiredField];
          if (isUndefined(value) || value === '') {
            isValidForm = false;
          }
        });
        // Also determine if contentTemplates had any invalid inputs
        resultTemplates =
          cloneDeep(prevState.contentTemplates) || resultTemplates;
        resultTemplates.forEach(template => {
          template.dirtyState = {};
          if (template.definition) {
            const requiredCTFields = template.definition.required || [];
            if (template.definition.properties) {
              Object.keys(template.definition.properties).reduce((acc, cur) => {
                const isRequiredInput = requiredCTFields.some(
                  field => field === cur
                );
                if (isRequiredInput && isUndefined(template.data[cur])) {
                  isValidForm = false;
                }
                acc[cur] = true;
                return acc;
              }, template.dirtyState);
            }
          }
        });
        return {
          formDirtyStates,
          contentTemplates: resultTemplates
        };
      },
      () => {
        if (isValidForm) {
          const cloneCTs = cloneDeep(resultTemplates);
          cloneCTs.forEach(template => delete template.guid);
          const acls = Object.values(this.state.organizations)
            .filter(organization => organization.permission)
            .map(organization => {
              return {
                organizationId: organization.id,
                permission: organization.permission
              };
            });
          this.props.onSubmit({
            sourceConfiguration: this.state.sourceConfig,
            contentTemplates: cloneCTs,
            share: {
              ...this.state.share,
              acls: acls
            }
          });
        }
      }
    );
  };

  render() {
    const { activeTab } = this.state;
    let title = this.state.sourceConfig.name || 'New Source';
    if (this.props.isReadOnly) {
      title += ' (Read Only)';
    }

    const authConfigs = pick(this.props.appConfig, [
      'boxClientId',
      'dropboxClientId',
      'googleDriveClientId'
    ]);

    return (
      <FullScreenDialog open={this.state.openDialog}>
        <div className={styles['sm-form-wrapper']}>
          <ModalHeader
            title={title}
            icons={[
              <IconButton aria-label="exit" key="icon-3">
                <Icon
                  className="icon-close-exit"
                  onClick={this.handleCloseDialog}
                />
              </IconButton>
            ]}
          >
            <Tabs
              classes={{ indicator: styles['tab-indicator'] }}
              value={activeTab}
              onChange={this.handleChangeTab}
            >
              <Tab
                label="Configuration"
                classes={{ label: styles['form-tab'] }}
              />
              <Tab
                label="Content Templates"
                classes={{ label: styles['form-tab'] }}
              />
              {this.props.canShare ? (
                <Tab label="Sharing" classes={{ label: styles['form-tab'] }} />
              ) : null}
            </Tabs>
          </ModalHeader>
          <form onSubmit={this.handleSubmit} className={styles['form-scroll']}>
            {activeTab === 0 && (
              <SourceConfiguration
                sourceTypes={this.props.sourceTypes}
                source={this.state.sourceConfig}
                onInputChange={this.saveConfiguration}
                getFieldOptions={this.props.getFieldOptions}
                errorFields={this.state.formDirtyStates}
                isReadOnly={this.props.isReadOnly}
                onClose={this.handleCloseDialog}
                {...authConfigs}
              />
            )}
            {activeTab === 1 && (
              <ContentTemplates
                templateData={this.props.templateData}
                selectedTemplateSchemas={this.state.contentTemplates}
                onAddTemplate={this.addToTemplateList}
                onRemoveTemplate={this.removeFromTemplateList}
                onInputChange={this.updateTemplateDetails}
                getFieldOptions={this.props.getFieldOptions}
                isReadOnly={this.props.isReadOnly}
              />
            )}
            {activeTab === 2 && (
              <div className={styles.shareContainer}>
                <SharingConfiguration
                  organizations={this.state.organizations}
                  isPublic={this.state.share.isPublic}
                  defaultPermission="viewer"
                  onAclsChange={this.handleAclsChange}
                  showMakePublic
                  onIsPublicChange={this.handleIsPublicChange}
                  sharingSectionDescription="Share this source across organizations."
                  aclGroupsSectionDescription="Grant organizations permission to this source and its contents."
                  publicSectionDescription="Share this source and all of its content with all of Veritone."
                  isReadOnly={this.props.isReadOnly}
                />
              </div>
            )}
            {!this.props.isReadOnly ? (
              <div className={styles['btn-container']}>
                <Button onClick={this.handleCloseDialog}>Cancel</Button>
                <Button variant="raised" color="primary" type="submit">
                  {get(this.props, 'source.id') ? 'Save' : 'Create'}
                </Button>
              </div>
            ) : null}
          </form>
        </div>
      </FullScreenDialog>
    );
  }
}
