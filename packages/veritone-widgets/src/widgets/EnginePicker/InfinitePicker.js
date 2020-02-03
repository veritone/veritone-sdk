import React from 'react';
import {
  string,
  number,
  arrayOf,
  object,
  objectOf,
  any,
  bool,
  func,
  shape
} from 'prop-types';
import { debounce } from 'lodash';
import { guid } from '../../shared/util';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';

import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ExpandableInputField } from 'veritone-react-common';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';

import styles from './styles';

class StatefulExpandableInputField extends React.Component {
  static propTypes = {
    onSearch: func,
    onReset: func
  };

  state = {
    value: ''
  };

  onChange = evt => {
    this.setState({ value: evt.target.value });
  };

  onReset = evt => {
    this.setState({ value: '' }, () => {
      if (this.props.onReset) {
        this.props.onReset();
      }
    });
  };

  render() {
    return (
      <ExpandableInputField
        onSearch={this.props.onSearch}
        icon={<SearchIcon />}
        value={this.state.value}
        onChange={this.onChange}
        onReset={this.onReset}
      />
    );
  }
}

class InfiniteTablePicker extends React.Component {
  static propTypes = {
    rowHeight: string,
    pickerHeight: string,
    pickerTitle: string,
    infiniteScrollDebounceTimeMs: number,
    infiniteScrollMargin: number,
    failedToLoadMessage: string,
    rows: arrayOf(object),
    loading: bool.isRequired,
    loadingFailed: bool.isRequired,
    lastSearch: string.isRequired,
    canSelectMore: bool,
    toggleGlobally: bool,
    hasMorePages: bool.isRequired,
    selected: objectOf(any),
    id: string,
    renderRow: func.isRequired,
    fetchMore: func.isRequired,
    toggleSelection: func,
    columns: arrayOf({
      name: string,
      width: string,
      paddingLeft: string
    }),
    maxSelections: number,
    classes: shape({ any }),
  };

  static defaultProps = {
    infiniteScrollMargin: 100,
    infiniteScrollDebounceTimeMs: 250,
    rowHeight: '65px',
    pickerHeight: '100%',
    failedToLoadMessage: 'Failed to load',
    id: guid(),
    maxSelections: 1
  };

  componentDidMount() {
    this.props.fetchMore({ id: this.props.id });
  }

  getToggleSelectionHandler = id => evt => {
    if (this.props.toggleGlobally) {
      this.props.toggleSelection({ rowId: id });
    } else {
      this.props.toggleSelection({ id: this.props.id, rowId: id });
    }
  };

  handleScroll = evt => {
    evt.persist();
    if (this.props.hasMorePages && !this.props.loading) {
      this.debouncedScroll(evt, this.props.id);
    }
  };

  onReset = evt => {
    this.props.fetchMore({ id: this.props.id });
  };

  debouncedScroll = debounce((evt, id) => {
    if (
      evt.target.scrollHeight -
      evt.target.scrollTop -
      this.props.infiniteScrollMargin <
      evt.target.clientHeight
    ) {
      this.props.fetchMore({
        id,
        search: this.props.lastSearch
      });
    }
  }, this.props.infiniteScrollDebounceTimeMs);

  retry = evt => {
    this.props.fetchMore({
      id: this.props.id
    });
  };

  onSearch = value => {
    if (this.props.lastSearch !== value) {
      this.props.fetchMore({
        id: this.props.id,
        search: value
      });
    }
  };

  isSelectionDisabled = rowId => {
    // selected rows can always be unselected
    if (this.props.selected && this.props.selected.hasOwnProperty(rowId)) {
      return false;
    }

    return !this.props.canSelectMore;
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper elevation={4} style={{ height: this.props.pickerHeight }}>
        <div className={classes.infinitePickerContainer}>
          <div className={classes.pickerTitle}>
            <div className={classes.pickerTitleContainer}>
              <Typography variant="h5">
                {this.props.pickerTitle}
              </Typography>
            </div>
            <div className={classes.pickerSearchContainer}>
              <StatefulExpandableInputField
                onSearch={this.onSearch}
                onReset={this.onReset}
              />
            </div>
          </div>
          <div className={classes.tableContainer} onScroll={this.handleScroll}>
            <Table className={classes.table}>
              <TableHead className={classes.infiniteScrollHeader}>
                <TableRow>
                  {this.props.columns.map(column => (
                    <TableCell
                      key={`header_${column.name}`}
                      style={{
                        width: column.width,
                        paddingRight: '8px',
                        minWidth: column.width,
                        paddingLeft: column.paddingLeft
                      }}
                    >
                      <Typography variant="subtitle1">{column.name}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody className={classes.infiniteScrollContainer}>
                {this.props.loadingFailed && (
                  <TableRow className={classes.rowLoader}>
                    <TableCell
                      colSpan={this.props.columns.length}
                      className={classes.rowLoaderSpinner}
                    >
                      <Typography variant="subtitle1" gutterBottom>
                        {this.props.failedToLoadMessage}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.retry}
                      >
                        Retry
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
                {this.props.rows &&
                  this.props.rows.map(row => (
                    <TableRow
                      key={`infinite_row_${row.id}`}
                      style={{ height: this.props.rowHeight }}
                      selected={
                        this.props.selected && row.id in this.props.selected
                      }
                      classes={{ selected: classes.selected }}
                    >
                      {this.props.maxSelections === 1 ? (
                        <TableCell
                          style={{ minWidth: this.props.columns[0].width }}
                        >
                          <Radio
                            disabled={this.isSelectionDisabled(row.id)}
                            value={row.id}
                            onChange={this.getToggleSelectionHandler(row.id)}
                          />
                        </TableCell>
                      ) : (
                          <TableCell
                            style={{ minWidth: this.props.columns[0].width }}
                          >
                            <Checkbox
                              disabled={this.isSelectionDisabled(row.id)}
                              value={row.id}
                              checked={
                                this.props.selected &&
                                row.id in this.props.selected
                              }
                              onChange={this.getToggleSelectionHandler(row.id)}
                            />
                          </TableCell>
                        )}
                      {this.props.renderRow(row)}
                    </TableRow>
                  ))}
                {this.props.loading &&
                  (!this.props.rows || this.props.rows.length === 0) && (
                    <TableRow className={classes.rowLoader}>
                      <TableCell
                        colSpan={this.props.columns.length}
                        className={classes.rowLoaderSpinner}
                      >
                        <CircularProgress size={60} />
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>
          {this.props.loading &&
            this.props.rows &&
            this.props.rows.length > 0 && (
              <div className={classes.firstLoader}>
                <CircularProgress size={60} />
              </div>
            )}
        </div>
      </Paper>
    );
  }
}

const InfinitePicker = withStyles(styles)(InfiniteTablePicker);
export { InfinitePicker };
