import React from 'react';

import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Menu, { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';
import CheckIcon from 'material-ui-icons/Done';

import { objectOf, any, func, arrayOf, string, bool } from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import styles from './styles.scss';

export default class SourceDropdownMenu extends React.Component {
  static propTypes = {
    sourceId: string,
    sources: arrayOf(objectOf(any)).isRequired,
    handleSourceChange: func.isRequired,
    openCreateSource: func.isRequired,
    closeCreateSource: func.isRequired
  }
  render() {
    return (
      <div>
        <div className={styles.adapterContainer}>
          <div className={styles.adapterHeader}>Select a Source</div>
          <div className={styles.adapterDescription}>
            Select from your available ingestion sources or create a new source.
          </div>
        </div>
        <div className={styles.adapterContainer}>
          <SourceContainer
            initialValue={this.props.sourceId}
            sources={this.props.sources}
            handleSourceChange={this.props.handleSourceChange}
            openCreateSource={this.props.openCreateSource}
            closeCreateSource={this.props.closeCreateSource}
            selectLabel="Select a Source*"
          />
        </div>
      </div>
    );
  }
}

@withMuiThemeProvider
class SourceContainer extends React.Component {
  static propTypes = {
    initialValue: string,
    sources: arrayOf(objectOf(any)),
    handleSourceChange: func.isRequired,
    selectLabel: string,
    openCreateSource: func.isRequired,
    closeCreateSource: func.isRequired
  };

  state = {
    anchorEl: null
  };

  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  openCreateSource = () => {
    console.log('closing menu and opening source modal');
    this.setState(
      { anchorEl: null, isCreateSourceOpen: true },
      this.props.openCreateSource
    );
  };

  closeCreateSource = () => {
    this.props.closeCreateSource();
    this.setState({ isCreateSourceOpen: false, anchorEl: null });
  };

  render() {
    return (
      <SourceSelector
        initialValue={this.props.initialValue}
        sources={this.props.sources}
        handleSourceChange={this.props.handleSourceChange}
        handleMenuClose={this.handleMenuClose}
        handleMenuClick={this.handleMenuClick}
        selectLabel={this.props.selectLabel}
        anchorEl={this.state.anchorEl}
        isCreateSourceOpen={this.state.isCreateSourceOpen}
        openCreateSource={this.openCreateSource}
        closeCreateSource={this.closeCreateSource}
      />
    );
  }
}

const SourceSelector = ({
  initialValue,
  sources,
  handleSourceChange,
  selectLabel,
  handleMenuClick,
  handleMenuClose,
  anchorEl,
  openCreateSource,
  isCreateSourceOpen,
  closeCreateSource
}) => {
  let sourceMenuItems = sources.map(source => {
    function handleItemClick() {
      handleSourceChange(source.id);
      handleMenuClose();
    }
    let version = source.sourceType && source.sourceType.sourceSchema ? source.sourceType.sourceSchema.majorVersion + '.' + source.sourceType.sourceSchema.majorVersion : undefined;
    return (
      <MenuItem
        key={source.id}
        value={source.id}
        selected={source.id === initialValue}
        onClick={handleItemClick}
      >
        {
          source.id === initialValue ?
            <span className={styles.menuIconSpacer}>
              <CheckIcon />
            </span> :
            <span className={styles.menuIconSpacer} />
        }
        <span className={styles.sourceMenuItemName}>{source.name}</span>
        {
          version ?
            <span className={styles.sourceMenuItemVersion}>Version {version}</span> :
            null
        }
      </MenuItem>
    );
  });
  const menuId = 'long-menu';
  const dummyItem = 'dummy-item';
  let selectedSource = sources.find(source => source.id === initialValue);
  return (
    <FormControl>
      <InputLabel
        htmlFor="select-source"
        className={styles.sourceLabel}
      >
        Select a Source*
      </InputLabel>
      <Select
        className={styles.sourceSelector}
        value={initialValue || dummyItem}
        onClick={handleMenuClick}
        aria-label="Select Source"
        aria-owns={anchorEl ? menuId : null}
        aria-haspopup="true"
        readOnly
        inputProps={{
          name: 'source',
          id: 'select-source'
        }}
      >
        <MenuItem key={dummyItem} value={initialValue || dummyItem}>
          {selectedSource ? selectedSource.name : '---'}
        </MenuItem>
      </Select>
      <Menu
        id={menuId}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorEl={anchorEl}
        PaperProps={{
          style: {
            maxHeight: 400,
            minWidth: 400,
            overflow: 'hidden',
            width: 'auto'
          }
        }}
      >
        <div key="scroll-container" className={styles.sourceScrollContainer}>
          {sourceMenuItems}
        </div>
        <div>
          <MenuItem
            className={styles.createSourceItem}
            key="create-source-menu-item"
            value={null}
            onClick={openCreateSource}
          >
            Create New Source
          </MenuItem>
        </div>
      </Menu>
    </FormControl>
  );
};

SourceSelector.propTypes = {
  initialValue: string,
  sources: arrayOf(objectOf(any)).isRequired,
  handleSourceChange: func.isRequired,
  selectLabel: string,
  handleMenuClick: func,
  handleMenuClose: func,
  anchorEl: objectOf(any),
  openCreateSource: func.isRequired,
  isCreateSourceOpen: bool,
  closeCreateSource: func.isRequired
};