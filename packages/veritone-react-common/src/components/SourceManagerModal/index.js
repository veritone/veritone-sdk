import React from 'react';

import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';
import Dialog from 'material-ui/Dialog';
import Tabs, { Tab } from 'material-ui/Tabs';
import ArrowBack from 'material-ui-icons/ArrowBack';

import {
  objectOf,
  any,
  func,
  arrayOf,
  bool
} from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import SourceConfiguration from '../SourceManagement';
import ContentTemplates from '../ContentTemplates';

@withMuiThemeProvider
export default class SourceManagerModal extends React.Component {
  static propTypes = {
    open: bool,
    handleClose: func.isRequired,
    source: objectOf(any),
    getSavedSource: func,
    sourceTypes: arrayOf(objectOf(any)).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0
    };
    if (this.props.source) {
      this.state.source = this.props.source;
      this.state.contentTemplates = this.props.source.contentTemplates || {};
    } else {
      this.state.source = {
        sourceType: this.props.sourceTypes[0],
      };
      this.state.contentTemplates = {};
    }
  }

  handleChange = (event, value) => {
    this.setState({ tabIndex: value });
  };

  handleChangeIndex = index => {
    this.setState({ tabIndex: index });
  };

  saveSource = source => {
    let params = `{
      ${source.id ? 'id: "' + source.id + '",' : ''}
      name: "${source.sourceName}",
      sourceTypeId: "${source.schemaResult.sourceTypeId}",
      details: "${JSON.stringify(source.schemaResult.fieldValues)}",
      contentTemplate: "${JSON.stringify(this.state.contentTemplate)}"
    }`;
    let query = `
      ${source.id ? 'update' : 'create'}Source (
        input: ${params}) {
        id
        name
        organization {
          id
          name
          jsondata
        }
        isPublic
        details
        sourceType {
          id
          name
          sourceSchema {
            id
            definition
            validActions
            status
          }
        }
        contentTemplates {
          id
          sourceId
          schemaId
          sdo {
            id
            dataString
            data
          }
        }
      }
    `;
    // TODO: Figure out how to make this mutation...
    console.log(query);
  };

  render() {
    const TAB_TEMPLATES = [{
      label: 'Configuration',
      content: (
        <SourceConfiguration
          source={this.state.source}
          sourceTypes={this.props.sourceTypes}
          submitCallback={this.saveSource}/>
      )
    }, {
      label: 'Content Templates',
      content: (
          <ContentTemplates templates={this.state.contentTemplates} source={this.state.source} />
      )
    }];
    const TAB_HEADERS = TAB_TEMPLATES.map(tab => <Tab key={tab.label} label={tab.label} />);
    const TAB_CONTENTS = TAB_TEMPLATES.map(tab => <TabContainer key={tab.label}>{tab.content}</TabContainer>)

    return (
      <Dialog
        modal="true"
        open={this.props.open}
        fullScreen
      >
        <Toolbar>
          <IconButton color="inherit" onClick={this.props.handleClose} aria-label="Close">
            <ArrowBack />
          </IconButton>
          <Typography variant="title" color="inherit">
            {this.props.source ? this.props.source.name : 'Create a Source'}
          </Typography>
        </Toolbar>
        <Toolbar>
          <Tabs
            indicatorColor="primary"
            onChange={this.handleChange}
            value={this.state.tabIndex}
            fullWidth>
            {TAB_HEADERS}
          </Tabs>
        </Toolbar>
        {TAB_CONTENTS[this.state.tabIndex]}
      </Dialog>
    );
  }
}

const TabContainer = (props) => {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: objectOf(any)
};