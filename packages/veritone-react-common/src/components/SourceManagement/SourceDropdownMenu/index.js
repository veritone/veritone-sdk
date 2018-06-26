import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import CheckIcon from '@material-ui/icons/Done';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

import { objectOf, any, func, arrayOf, string, bool, number } from 'prop-types';
import { get, cloneDeep, noop } from 'lodash';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import styles from './styles.scss';

export default class SourceDropdownMenu extends React.Component {
  static propTypes = {
    sourceId: string,
    handleSourceChange: func.isRequired,
    openCreateSource: func.isRequired,
    closeCreateSource: func.isRequired,
    loadNextPage: func.isRequired
  };

  state = {
    hasNextPage: false,
    isNextPageLoading: false,
    sources: []
  }

  UNSAFE_componentWillMount() {
    this.loadMoreRows({ startIndex: 0, stopIndex: 30 });
  }

  loadMoreRows = ({startIndex, stopIndex}) => {
    this.setState({ isNextPageLoading: true });
    return this.props.loadNextPage({startIndex, stopIndex}).then(sourcePage => {
      const newState = {
        hasNextPage: !!get(sourcePage, 'length'),
        isNextPageLoading: false,
        sources: cloneDeep(this.state.sources).concat(sourcePage)
      }
      if (newState.sources.length && !this.props.sourceId) {
        this.props.handleSourceChange(newState.sources[0].id);
      }
      this.setState(newState);
      return sourcePage;
    });
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
            sources={this.state.sources}
            handleSourceChange={this.props.handleSourceChange}
            openCreateSource={this.props.openCreateSource}
            closeCreateSource={this.props.closeCreateSource}
            selectLabel="Select a Source*"
            hasNextPage={this.state.hasNextPage}
            isNextPageLoading={this.state.isNextPageLoading}
            loadNextPage={this.loadMoreRows}
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
    closeCreateSource: func.isRequired,
    hasNextPage: bool.isRequired,
    isNextPageLoading: bool.isRequired,
    loadNextPage: func.isRequired
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
    this.setState(
      { anchorEl: null, isCreateSourceOpen: true },
      this.props.openCreateSource
    );
  };

  closeCreateSource = () => {
    this.props.closeCreateSource();
    this.setState({ isCreateSourceOpen: false, anchorEl: null });
  };

  isRowLoaded = ({ index }) => get(this.props.sources, index);

  rowRenderer = ({ index, key, style }) => {
    let source;
    if (!this.isRowLoaded({ index })) {
      source = {
        name: 'Loading...'
      };
    } else {
      source = this.props.sources[index];
    }

    const version =
    source.sourceType && source.sourceType.sourceSchema
      ? source.sourceType.sourceSchema.majorVersion +
        '.' +
        source.sourceType.sourceSchema.minorVersion
      : undefined;

    const handleItemClick = source => () => {
      this.props.handleSourceChange(source.id);
      this.handleMenuClose();
    }

    return (
      <div
        key={key}
        style={style}
      >
        <MenuItem
          key={source.id}
          value={source.id}
          selected={source.id === this.props.initialValue}
          onClick={handleItemClick(source)}
        >
          {source.id === this.props.initialValue ? (
            <span className={styles.menuIconSpacer}>
              <CheckIcon />
            </span>
          ) : (
            <span className={styles.menuIconSpacer} />
          )}
          <span className={styles.sourceMenuItemName}>{source.name}</span>
          {version && !version.includes('undefined') ? (
            <span className={styles.sourceMenuItemVersion}>
              Version {version}
            </span>
          ) : null}
        </MenuItem>
      </div>
    );
  };

  render() {
    const rowCount = this.props.hasNextPage
      ? this.props.sources.length + 1
      : this.props.sources.length;
    const loadMoreRows = this.props.isNextPageLoading
      ? noop
      : this.props.loadNextPage;

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
        rowCount={rowCount}
        loadMoreRows={loadMoreRows}
        isRowLoaded={this.isRowLoaded}
        rowRenderer={this.rowRenderer}
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
  closeCreateSource,
  rowCount,
  loadMoreRows,
  isRowLoaded,
  rowRenderer
}) => {
  const menuId = 'long-menu';
  const dummyItem = 'dummy-item';
  const selectedSource = sources.find(source => source.id === initialValue);

  return (
    <FormControl>
      <InputLabel htmlFor="select-source" className={styles.sourceLabel}>
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
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={loadMoreRows}
            rowCount={rowCount}
            threshold={1}
          >
            {({ onRowsRendered, registerChild }) => (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <List
                    width={width}
                    height={144}
                    rowCount={rowCount}
                    rowHeight={48}
                    ref={registerChild}
                    onRowsRendered={onRowsRendered}
                    rowRenderer={rowRenderer}
                  />
                )}
              </AutoSizer>
            )}
          </InfiniteLoader>
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
  closeCreateSource: func.isRequired,
  rowCount: number,
  loadMoreRows: func,
  isRowLoaded: func,
  rowRenderer: func
};
