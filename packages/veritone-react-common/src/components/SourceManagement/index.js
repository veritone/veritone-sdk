import React from 'react';
import { arrayOf, objectOf, any, func, number } from 'prop-types';
import Tabs, { Tab } from 'material-ui/Tabs';
import FullScreenDialog from 'components/FullScreenDialog';
import SourceManagementNullState from './Nullstate';
import SourceTileView from './SourceRow';
import SourceConfiguration from './SourceConfiguration';
import ContentTemplates from './ContentTemplates';
import ModalHeader from 'components/ModalHeader';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import styles from './styles.scss';
// import ModalHeader from 'components/ModalHeader';

export default class SourceManagementOverview extends React.Component {
  static propTypes = {
    sources: arrayOf(objectOf(any)),
    onSubmit: func.isRequired,
  }

  static defaultProps = {
    sources: []
  }

  state = {
    selectedSource: null,
    sourceConfig: {
      sourceName: '',
      sourceThumbnail: '',
      fieldValues: {},
      requiredFields: {},
      sourceTypeId: ''
    },
    contentTemplates: {},
    openFormDialog: false,
    activeTab: 0
  }

  selectSource = (selectedSource) => {
    this.setState({ selectedSource })
  }

  openDialog = () => {
    return this.setState({ openFormDialog: true });
  };

  handleOnClose = () => {
    return this.setState({ openFormDialog: false });
  }

  handleChangeTab = (e, tabIdx) => {
    return this.setState({ activeTab: tabIdx });
  }

  saveConfiguration = (config) => {
    // return this.props.onSubmit(config);
    return this.setState({
      sourceConfig: {
        ...this.state.sourceConfig,
        ...config
      }
    });
  }
  
  handleSubmitContentTemplates = (templates) => {
    return this.props.onSubmit(templates);
  }

  renderDialog = () => {
    const { activeTab } = this.state;

    return (
      <FullScreenDialog
        open={this.state.openFormDialog}
      >
        <ModalHeader
          title={this.state.selectedSource ? this.state.selectedSource.name : "New Source"}
          icons={[
            <IconButton aria-label='help' key={1}>
              <Icon className='icon-help2' />
            </IconButton>,
            <IconButton aria-label='menu' key={2}>
              <Icon className='icon-more_vert' />
            </IconButton>,
            <IconButton aria-label='trash' key={3}>
              <Icon className='icon-trash' />
            </IconButton>,
            <span className={styles.separator} key={4} />,
            <IconButton aria-label='exit' key={5}>
              <Icon className='icon-close-exit' onClick={this.handleOnClose} />
            </IconButton>
          ]}
        >
          <Tabs value={activeTab} onChange={this.handleChangeTab}>
            <Tab label="Configuration" />
            <Tab label="Content Templates" />
          </Tabs>
        </ModalHeader>
        {activeTab === 0 &&
          <SourceConfiguration
            source={this.props.sources[this.state.selectedSource] || this.state.sourceConfig}
            onInputChange={this.saveConfiguration}
            onClose={this.handleOnClose} />}
        {activeTab === 1 && 
          <ContentTemplates
            onSubmit={this.handleSubmitContentTemplates}
            onCancel={this.handleOnClose} />}
        <div className={styles.btnContainer}>
          <Button onClick={this.props.onCancel}>
            Cancel
          </Button>
          <Button raised color='primary' type="submit">
            Create
          </Button>
        </div>
      </FullScreenDialog>
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
