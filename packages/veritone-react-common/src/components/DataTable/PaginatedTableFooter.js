import React from 'react';
import cx from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TableCell from '@material-ui/core/TableCell';
import SelectInput from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/styles';

import { func, number, shape, any } from 'prop-types';
import RefreshButton from 'components/RefreshButton';
import styles from './styles/index';
class PaginatedTableFooter extends React.Component {
  static propTypes = {
    page: number.isRequired,
    perPage: number.isRequired,
    onChangePage: func.isRequired,
    onChangePerPage: func.isRequired,
    onRefreshPageData: func,
    rowCount: number,
    colSpan: number,
    classes: shape({any})
  };

  static defaultProps = {
    colSpan: 1
  };

  handleFirstPageButtonClick = event => {
    this.props.onChangePage(0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      Math.max(0, Math.ceil(this.props.rowCount / this.props.perPage) - 1)
    );
  };

  render() {
    const { rowCount, page, perPage, classes } = this.props;
    const firstItem = page * perPage + 1;
    const lastItem = Math.min(page * perPage + perPage, rowCount);

    return (
      <TableCell
        colSpan={this.props.colSpan}
        style={{
          textAlign: 'right'
        }}
      >
        <div className={classes['paginatedFooter']}>
          <span className={classes['rowsPerPage']}>Rows per page:</span>

          <SelectInput
            value={this.props.perPage}
            onChange={this.props.onChangePerPage}
            className={classes['perPage']}
            style={{
              width: '4em',
              padding: '0 5px',
              margin: '0 5px'
            }}
            autoWidth
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </SelectInput>

          <span className={classes['numItems']}>
            {firstItem}–{lastItem} of {rowCount}
          </span>

          {/* .pageLeft and .pageRight are unit test targets */}
          <IconButton
            onClick={this.handleFirstPageButtonClick}
            disabled={page === 0}
          >
            <FirstPageIcon />
          </IconButton>

          <IconButton
            className={cx(classes['pageLeft'], 'pageLeft')}
            onClick={this.handleBackButtonClick}
            disabled={page === 0}
          >
            <KeyboardArrowLeft />
          </IconButton>

          <IconButton
            className={cx(classes['pageRight'], 'pageRight')}
            onClick={this.handleNextButtonClick}
            disabled={page >= Math.ceil(rowCount / perPage) - 1}
          >
            <KeyboardArrowRight />
          </IconButton>

          <IconButton
            onClick={this.handleLastPageButtonClick}
            disabled={page >= Math.ceil(rowCount / perPage) - 1}
          >
            <LastPageIcon />
          </IconButton>

          {this.props.onRefreshPageData && (
            <RefreshButton
              onRefresh={this.props.onRefreshPageData}
              className={cx(classes['refresh'], 'refresh')}
            />
          )}
        </div>
      </TableCell>
    );
  }
}

PaginatedTableFooter.muiName = 'TableFooter';


export default withStyles(styles)(PaginatedTableFooter);