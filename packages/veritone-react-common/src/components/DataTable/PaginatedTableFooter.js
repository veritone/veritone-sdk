import React from 'react';
import cx from 'classnames';
import { TableFooter, TableRow, TableRowColumn } from 'material-ui/Table';
import Select from 'material-ui/Select';
import MenuItem from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import RightIcon from 'material-ui-icons/ChevronRight';
import LeftIcon from 'material-ui-icons/ChevronLeft';

import RefreshButton from '/components/RefreshButton';
import styles from './styles/index.scss';
import { bool, number, func } from 'prop-types';

export default class PaginatedTableFooter extends React.Component {
  static propTypes = {
    page: number.isRequired,
    perPage: number.isRequired,
    onPageLeft: func.isRequired,
    onPageRight: func.isRequired,
    onChangePerPage: func.isRequired,
    onRefreshPageData: func,
    rowCount: number,
    colSpan: number,
    adjustForCheckbox: bool
  };
  static defaultProps = {
    colSpan: 1
  };

  render() {
    const firstItem = this.props.page * this.props.perPage + 1;
    const lastItem = Math.min(
      this.props.page * this.props.perPage + this.props.perPage,
      this.props.rowCount
    );

    return (
      <TableFooter adjustForCheckbox={this.props.adjustForCheckbox}>
        <TableRow className={styles['paginated-footer']}>
          <TableRowColumn
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }} // fixme
          >
            <span className={styles['rows-per-page']}>Rows per page:</span>

            <Select
              value={this.props.perPage}
              onChange={this.props.onChangePerPage}
              className={styles['per-page']}
              style={{ width: '4em' }}
              autoWidth
            >
              <MenuItem value={10} primaryText="10" />
              <MenuItem value={20} primaryText="20" />
              <MenuItem value={30} primaryText="30" />
            </Select>

            <span className={styles['num-items']}>
              {firstItem}–{lastItem} of {this.props.rowCount}
            </span>

            {/* .pageLeft and .pageRight are unit test targets */}
            <IconButton
              className={cx(styles['page-left'], 'pageLeft')}
              onClick={this.props.onPageLeft}
              disabled={firstItem === 1}
            >
              <LeftIcon />
            </IconButton>

            <IconButton
              className={cx(styles['page-right'], 'pageRight')}
              onClick={this.props.onPageRight}
              disabled={lastItem === this.props.rowCount}
            >
              <RightIcon />
            </IconButton>

            {this.props.onRefreshPageData &&
              <RefreshButton
                onRefresh={this.props.onRefreshPageData}
                className={cx(styles['refresh'], 'refresh')}
              />}
          </TableRowColumn>
        </TableRow>
      </TableFooter>
    );
  }
}
PaginatedTableFooter.muiName = 'TableFooter';
