import React from 'react';
import { arrayOf, string, shape, func, node } from 'prop-types';
import { withStyles } from '@material-ui/styles';
import {
  Folder,
  InsertDriveFile,
  KeyboardVoice,
  Videocam
} from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import classNames from 'classnames';

import InfiniteWrapper from '../InfiniteWrapper';
import infiniteWrapperShape from '../InfiniteWrapper/infiniteWrapperShape';
import itemShape from './itemShape';

const muiStyles = () => ({
  tableHeadRow: {
    height: 0,
    padding: 0,
  },
  tableRowHeadColumn: {
    height: 0,
    lineHeight: 0,
    visibility: 'hidden',
    whiteSpace: 'nowrap',
    padding: 0
  },
  tableRow: {
    borderBottom: 0,
    color: 'rgba(0,0,0,0.54)',
    cursor: 'pointer',
    userSelect: 'none'
  },
  tableRowFirstColumn: {
    display: 'flex',
    alignItems: 'center'
  },
  text: {
    paddingLeft: 12,
  },
  Folder: {
    color: 'rgba(0,0,0,0.87)',
    fontWeight: 500,
  },
  highlighted: {
    background: '#F0F0F0'
  },
  selected: {
    background: 'rgba(0,0,0,0.37)'
  },
  tableContainer: {
    paddingTop: 48,
    position: 'relative',
    width: '100%',
  },
  tableRowText: {
    visibility: 'visible',
    position: 'absolute',
    lineHeight: 1.5,
    top: 0,
    padding: '15px 56px 15px 24px',
  }
});

const FILE_ICONS = {
  'Folder': Folder,
  'audio/mp3': KeyboardVoice,
  'video/mp4': Videocam,
  'doc': InsertDriveFile
}

const DEFAULT_THRESHOLD = 80;

const genArray = (a, b) => new Array(Math.max(a, b) - Math.min(a, b) + 1)
  .fill(0).map((_, i) => i + Math.min(a, b));

const DefaultLoading = () => (
  <div style={{
    alignItems: 'center',
    display: 'flex',
    height: 80,
    justifyContent: 'center',
  }}>
    <CircularProgress size={50} />
  </div>
)

class FilesTable extends React.Component {

  static propTypes = {
    headers: arrayOf(string),
    classes: shape(Object.keys(muiStyles).reduce(
      (classShape, key) => ({ classShape, [key]: string }), {})
    ),
    onSelectItem: func,
    items: arrayOf(itemShape),
    // eslint-disable-next-line react/no-unused-prop-types
    highlightedItems: arrayOf(itemShape),
    loadingComponent: node,
    triggerPagination: func.isRequired,
    ...infiniteWrapperShape
  }

  static defaultProps = {
    loadingComponent: <DefaultLoading />
  }

  state = {
    highlightedItems: {},
    lastIndex: undefined,
    shiftIndex: undefined,
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleArrowKey);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleArrowKey);
  }

  handleArrowKey = (event) => {
    const eventKeyCode = event.keyCode;
    const { lastIndex = 0, shiftIndex, highlightedItems } = this.state;
    if (this.noneHighligthedItem(highlightedItems)) {
      return;
    }
    if (eventKeyCode === 38) {
      if (event.shiftKey) {
        const currentIndex = isNaN(shiftIndex) ? lastIndex : shiftIndex;
        this.onShiftHighlight(Math.max(currentIndex - 1, 0));
      } else {
        const currentIndex = Math.max((lastIndex || 0) - 1, 0);
        this.onHighlight(parseInt(currentIndex, 10));
      }
      event.preventDefault();
    }

    if (eventKeyCode === 40) {
      const { items } = this.props;
      const currentIndex = isNaN(shiftIndex) ? lastIndex : shiftIndex;
      if (event.shiftKey) {
        this.onShiftHighlight(Math.min(currentIndex + 1, items.length - 1));
      } else {
        const currentIndex = Math.min((lastIndex || 0) + 1, items.length - 1);
        this.onHighlight(currentIndex);
      }
    }
    event.preventDefault();
  }

  onShiftHighlight = (index) => {
    const { items } = this.props;
    this.setState(({ lastIndex, highlightedItems }) =>
      this.noneHighligthedItem(highlightedItems) ? ({
        lastIndex: index,
        highlightedItems: {
          [items[index].id]: true
        },
        shiftIndex: index
      }) : ({
        shiftIndex: index,
        highlightedItems: {
          ...genArray(lastIndex, index)
            .map(itemIndex => items[itemIndex].id)
            .reduce((highlighting, itemId) => ({
              ...highlighting,
              [itemId]: true
            }), {}),
        },
      }))
  }

  onHighlight = (index) => {
    const itemId = this.props.items[index].id
    this.setState({
      highlightedItems: {
        [itemId]: true
      },
      lastIndex: index,
      shiftIndex: index
    });
  }

  noneHighligthedItem = (highlightedItems) =>
    Object.keys(highlightedItems)
      .filter(key => highlightedItems[key]).length === 0;

  onHighlightItem = (event) => {
    const { index } = Object.assign({}, event.currentTarget.dataset);
    const holdingShift = event.shiftKey;
    const holdingCtrl = event.ctrlKey;
    if (!holdingShift && !holdingCtrl) {
      this.onHighlight(parseInt(index, 10));
    }
    if (holdingCtrl) {
      const itemId = this.props.items[index].id
      this.setState(({ highlightedItems }) => ({
        highlightedItems: {
          ...highlightedItems,
          [itemId]: !highlightedItems[itemId]
        },
        shiftIndex: parseInt(index, 10)
      }))
    }
    if (holdingShift) {
      this.onShiftHighlight(parseInt(index, 10));
    }
  }

  render() {
    const {
      classes,
      headers,
      items,
      onSelectItem,
      onMount,
      triggerPagination,
      finishedLoading,
      loadingComponent
    } = this.props;

    const { highlightedItems } = this.state;

    return (
      <div className={classes['tableContainer']}>
        <InfiniteWrapper
          finishedLoading={finishedLoading}
          threshold={DEFAULT_THRESHOLD}
          onMount={onMount}
          triggerPagination={triggerPagination}
          loadingComponent={loadingComponent}
        >
          <Table>
            <TableHead>
              <TableRow className={classes.tableHeadRow}>
                {
                  headers.map((header) => (
                    <TableCell
                      key={header}
                      className={classNames(
                        classes.tableRowHeadColumn,
                        classes.tableRow
                      )}
                      align="right"
                    >
                      {header}
                      <div className={classes['tableRowText']}>
                        {header}
                      </div>
                    </TableCell>
                  ))
                }
              </TableRow>
            </TableHead>
            <TableBody className={classes.tablebody}>
              {items.map(({ id, type, name, date }, index) => {
                const FileIcon = FILE_ICONS[type]
                return (
                  <TableRow
                    className={classNames({
                      [classes.selected]: highlightedItems[id]
                    })}
                    key={id}
                    data-id={id}
                    data-index={index}
                    onClick={this.onHighlightItem}
                    onDoubleClick={onSelectItem}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      className={classNames(
                        classes.tableRow,
                        classes.tableRowFirstColumn
                      )}
                    >
                      <FileIcon />
                      <span className={
                        classNames(classes.text, classes[type])
                      }
                      >
                        {name}
                      </span>
                    </TableCell>
                    <TableCell align="right" className={classes.tableRow}>
                      {date}
                    </TableCell>
                    <TableCell align="right" className={classes.tableRow}>
                      {type}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </InfiniteWrapper>
      </div>
    )
  }
}

export default withStyles(muiStyles)(FilesTable);
