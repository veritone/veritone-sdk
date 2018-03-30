import React from 'react';
import { arrayOf, objectOf, any } from 'prop-types';
import Tabs, { Tab } from 'material-ui/Tabs';
import FullScreenDialog from 'components/FullScreenDialog';
import SourceManagementNullState from './SourceConfiguration/Nullstate';
import SourceTileView from './SourceConfiguration/SourceRow';
import SourceConfiguration from './SourceConfiguration';
import ContentTemplates from './ContentTemplates';
import ModalHeader from 'components/ModalHeader';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import styles from './styles.scss';
// import ModalHeader from 'components/ModalHeader';

export default class SourceManagementOverview extends React.Component {
  static propTypes = {
    dataSources: arrayOf(objectOf(any)),
    currentSource: objectOf(any)
  }

  static defaultProps = {
    dataSources: []
  }

  state = {
    openFormDialog: false,
    activeTab: 0
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

  renderDialog = () => {
    const { activeTab } = this.state;

    return (
      <FullScreenDialog
        open={this.state.openFormDialog}
      >
        <ModalHeader
          title={this.props.currentSource ? this.props.currentSource.name : "New Source"}
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
        {activeTab === 0 && <SourceConfiguration onClose={this.handleOnClose} />}
        {activeTab === 1 && <ContentTemplates onCancel={this.handleOnClose} />}
      </FullScreenDialog>
    );
  }

  render() {
    return (
      <div>
        {
          this.props.dataSources.length
          ? <SourceManagementNullState onClick={this.openDialog} />
          : <SourceTileView sources={this.props.dataSources} />
        }
        {this.state.openFormDialog && this.renderDialog()}
      </div>
    );
  }
}
