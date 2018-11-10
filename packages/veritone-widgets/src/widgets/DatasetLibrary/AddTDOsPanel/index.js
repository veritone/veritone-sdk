import React from 'react';
import { func, arrayOf, shape, string } from 'prop-types';
import { find, get } from 'lodash';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import styles from './styles.scss';

export default class AddTDOsPanel extends React.Component {
  static propTypes = {
    librariesLabel: string,
    cancelLabel: string,
    addToDatasetLabel: string,
    createNewDatasetLabel: string,
    datasetLibraries: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ).isRequired,
    onCancel: func.isRequired,
    onAddToDataset: func.isRequired,
    onCreateNewDataset: func.isRequired
  };

  static defaultProps = {
    librariesLabel: 'Choose Dataset',
    cancelLabel: 'CANCEL',
    addToDatasetLabel: 'ADD TO DATASET',
    createNewDatasetLabel: 'CREATE NEW DATASET'
  };

  state = {}

  handleChange = (event) => {
    const selectedId = event.target.value;
    const { datasetLibraries } = this.props;
    const selectedLibrary = find(datasetLibraries, {'id': selectedId});
    selectedLibrary && this.setState({
      selectedLibrary: selectedLibrary
    });
  };

  handleAddTdos = () => {
    const { datasetLibraries, onAddToDataset } = this.props;
    const selectedLibrary = get(this.state, 'selectedLibrary') || get(datasetLibraries, '[0]');
    selectedLibrary && onAddToDataset(selectedLibrary);
  }

  render() {
    const {
      datasetLibraries,
      librariesLabel,
      cancelLabel,
      addToDatasetLabel,
      createNewDatasetLabel,
      onCancel,
      onCreateNewDataset
    } = this.props;

    const selectedId = get(this.state, 'selectedLibrary.id', '');
    const matchedLibrary = (find(datasetLibraries, {id: selectedId})) || datasetLibraries[0];
    const matchSelectedId = get(matchedLibrary, 'id', '');

    return (
      <form autoComplete="off" className={styles.addTdosPanel}>
        <FormControl className={styles.librarySelection}>
          <InputLabel htmlFor="library-name">{librariesLabel}</InputLabel>
          <Select value={matchSelectedId} onChange={this.handleChange}>
            {
              datasetLibraries.map((value) => {
                console.log(value);
                return <MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>
              })
            }
          </Select>
        </FormControl>
        <div className={styles.controllers}>
          <Button onClick={onCancel}>{cancelLabel}</Button>
          <Button onClick={onCreateNewDataset}>{createNewDatasetLabel}</Button>
          <Button variant="contained" color="primary" onClick={this.handleAddTdos}>{addToDatasetLabel}</Button>
        </div>
      </form>
    );
  }
}
