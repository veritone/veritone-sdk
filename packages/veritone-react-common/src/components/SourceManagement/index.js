import React from 'react';
import { arrayOf, objectOf, any, func, shape, string } from 'prop-types';
import { pick } from 'lodash';
import SourceManagementNullState from './Nullstate';
import SourceTileView from './SourceRow';
import SourceManagementForm from './SourceManagementForm';

export default class SourceManagementOverview extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(objectOf(any)).isRequired,
    sources: arrayOf(objectOf(any)),
    templateData: objectOf(shape({
      id: string,
      name: string.isRequired,
      status: string,
      definition: objectOf(any)
    })).isRequired,
    initialTemplates: objectOf(shape({
      id: string,
      name: string.isRequired,
      status: string,
      definition: objectOf(any),
      data: objectOf(any)
    })),
    onFormSubmit: func.isRequired,
  }

  state = {
    sourceConfig: null,
    openFormDialog: false
  }

  openDialog = () => {
    this.setState({ openFormDialog: true })
  }

  closeDialog = () => {
    this.setState({ openFormDialog: false });
  }

  selectSource = (selectedSource) => {
    const source = this.state.sources[selectedSource];
    const sourceConfig = pick(
      source,
      ['name', 'details', 'thumbnail', 'sourceTypeId', 'sourceType']
    );
  
    this.setState({
      // selectedSource,
      sourceConfig
    })
  }
  
  handleFormSubmit = (payload) => {
    return this.props.onFormSubmit(payload);
  }

  renderDialog = () => {
    return (
      <SourceManagementForm
        sourceTypes={this.props.sourceTypes}
        sources={this.props.sources}
        source={this.state.sourceConfig}
        templateData={this.props.templateData}
        initialTemplates={this.props.initialTemplates}
        onSubmit={this.handleFormSubmit}
        onClose={this.closeDialog}
      />
    );
  }

  render() {
    return (
      <div>
        {
          this.props.sources.length
          ? <SourceManagementNullState onClick={this.openDialog} />
          : <SourceTileView
              onSelectSource={this.selectSource}
              sources={this.props.sources}
            />
        }
        {this.state.openFormDialog && this.renderDialog()}
      </div>
    );
  }
}
