import React from 'react';
import { arrayOf, objectOf, any } from 'prop-types';
import Dialog from 'material-ui/Dialog';
import SourceManagementNullState from './Nullstate';
import SourceTileView from './SourceRow';
import SourceConfiguration from './';
import ModalHeader from 'components/ModalHeader';

export default class SourceManagementOverview extends React.Component {
  static propTypes = {
    dataSources: arrayOf(objectOf(any))
  }

  static defaultProps = {
    dataSources: []
  }

  state = {
    openFormDialog: false
  }

  openDialog = () => {
    return this.setState({ openFormDialog: true });
  };

  handleClose = () => {
    return this.setState({ openFormDialog: false });
  }

  renderDialog = () => {
    return (
      <Dialog
        fullScreen
        open={this.state.openFormDialog}
        onClose={this.handleClose}
        // transition={Transition}
      >
        <SourceConfiguration />
      </Dialog>
    )
  }

  render() {
    return (
      <div>
        {
          this.props.dataSources.length
          ? <SourceManagementNullState onClick={this.openDialog} />
          : <SourceTileView sources={this.props.dataSources} />
        }
        {this.state.openFormDialog &&
        <}
      </div>
    );
  }
}
