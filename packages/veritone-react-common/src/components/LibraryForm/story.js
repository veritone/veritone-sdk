import React, { Component, Fragment } from 'react';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import { func } from 'prop-types';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import LibraryForm from './index';

const store = createStore(
  combineReducers({
    form: formReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

class ModalClass extends Component {
  static propTypes = {
    onClose: func,
    onCreate: func
  };

  state = {
    modalOpen: false,
    libraryTypes: [
      {
        id: 'test-123',
        name: 'testLibraryType'
      }
    ]
  };

  handleToggleDialog = () => {
    this.setState(prevState => ({
      open: !prevState.open
    }));
  };

  handleCancel = () => {
    this.setState(
      {
        open: false
      },
      () => {
        this.props.onClose('Canceled');
      }
    );
  };

  handleSubmit = formData => {
    this.setState(
      {
        open: false
      },
      () => {
        this.props.onCreate(formData);
      }
    );
  };

  render() {
    return (
      <Fragment>
        <Button onClick={this.handleToggleDialog}>Toggle Dialog</Button>
        <Dialog
          open={this.state.open}
          PaperProps={{
            style: {
              width: '600px'
            }
          }}
        >
          <DialogTitle>{'Create New Library'}</DialogTitle>
          <DialogContent>
            <LibraryForm
              onSubmit={this.handleSubmit}
              onCancel={this.handleCancel}
              libraryTypes={this.state.libraryTypes}
            />
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

storiesOf('LibraryForm', module)
  .add('Base', () => {
    const initialValues = {
      libraryName: 'testLibraryName',
      libraryType: 'test-123',
      description: 'Initial Description'
    };
    const libraryTypes = [
      {
        id: 'test-123',
        name: 'Faces'
      }
    ];
    return (
      <Provider store={store}>
        <LibraryForm
          onSubmit={action('createLibrary')}
          onCancel={action('cancel')}
          initialValues={initialValues}
          libraryTypes={libraryTypes}
        />
      </Provider>
    );
  })
  .add('Inside a Modal', () => (
    <Provider store={store}>
      <ModalClass onClose={action('canceled')} onCreate={action('created')} />
    </Provider>
  ));
