import React from 'react';
import cx from 'classnames';
import IconButton from 'material-ui/IconButton';
import FirstPageIcon from 'material-ui-icons/FirstPage';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import LastPageIcon from 'material-ui-icons/LastPage';

import { func, number, shape, objectOf, string, any } from 'prop-types';
import RefreshButton from '/components/RefreshButton';
import styles from './styles/index.scss';

export default class PaginatedTableFooter extends React.Component {
  static propTypes = {
    page: number.isRequired,
    rowsPerPage: number.isRequired,
    onChangePage: func.isRequired,
    count: number.isRequired,
    onRefreshPageData: func,
    classes: shape({
      root: string
    }),
    theme: objectOf(any)
  };

  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes && classes.root}>
        {this.props.onRefreshPageData &&
          <RefreshButton
            onRefresh={this.props.onRefreshPageData}
            className={cx(styles['refresh'], 'refresh')}
          />}
        <IconButton
          className="pageFirst"
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          className="pageLeft"
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          className="pageRight"
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          className="pageLast"
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

// // PaginatedTableFooter.muiName = 'TableFooter';

// import React from 'react';
// import cx from 'classnames';
// import { TableFooter, TableRow, TableCell } from 'material-ui/Table';
// import Select from 'material-ui/Select';
// import { MenuItem } from 'material-ui/Menu';
// import IconButton from 'material-ui/IconButton';
// import RightIcon from 'material-ui-icons/KeyboardArrowRight';
// import LeftIcon from 'material-ui-icons/KeyboardArrowLeft';
// import FirstPageIcon from 'material-ui-icons/FirstPage';
// import LastPageIcon from 'material-ui-icons/LastPage';

// import RefreshButton from '/components/RefreshButton';
// import styles from './styles/index.scss';
// import { bool, number, func } from 'prop-types';

// export default class PaginatedTableFooter extends React.Component {
//   static propTypes = {
//     page: number.isRequired,
//     perPage: number.isRequired,
//     onChangePerPage: func.isRequired,
//     onRefreshPageData: func,
//     rowCount: number,
//     colSpan: number,
//     // adjustForCheckbox: bool
//   };
//   static defaultProps = {
//     colSpan: 1
//   };

//   handleFirstPageButtonClick = event => {
//     this.props.onChangePage(event, 0);
//   };

//   handleBackButtonClick = event => {
//     this.props.onChangePage(event, this.props.page - 1);
//   };

//   handleNextButtonClick = event => {
//     this.props.onChangePage(event, this.props.page + 1);
//   };

//   handleLastPageButtonClick = event => {
//     this.props.onChangePage(
//       event,
//       Math.max(0, Math.ceil(this.props.rowCount / this.props.rowsPerPage) - 1),
//     );
//   };

//   render() {
//     const firstItem = this.props.page * this.props.perPage + 1;
//     const lastItem = Math.min(
//       this.props.page * this.props.perPage + this.props.perPage,
//       this.props.rowCount
//     );

//     return (
//       // <TableFooter colSpan={this.props.colSpan}>
//         // {/* <TableRow className={styles['paginated-footer']}> */}
//           <TableCell
//             style={{
//               display: 'flex',
//               justifyContent: 'flex-end',
//               alignItems: 'center'
//             }} // fixme
//           >
//             <span className={styles['rows-per-page']}>Rows per page:</span>

//             <Select
//               value={this.props.perPage}
//               onChange={this.props.onChangePerPage}
//               className={styles['per-page']}
//               style={{ width: '4em' }}
//               autoWidth
//             >
//               <MenuItem value={10}>10</MenuItem>
//               <MenuItem value={20}>20</MenuItem>
//               <MenuItem value={30}>30</MenuItem>
//             </Select>

//             <span className={styles['num-items']}>
//               {firstItem}–{lastItem} of {this.props.rowCount}
//             </span>

//             {/* .pageLeft and .pageRight are unit test targets */}
//             <IconButton
//               className={cx(styles['page-left'], 'pageLeft')}
//               onClick={this.handleBackButtonClick}
//               disabled={firstItem === 1}
//             >
//               <LeftIcon />
//             </IconButton>

//             <IconButton
//               className={cx(styles['page-right'], 'pageRight')}
//               onClick={this.handleNextButtonClick}
//               disabled={lastItem === this.props.rowCount}
//             >
//               <RightIcon />
//             </IconButton>

//             {this.props.onRefreshPageData &&
//               <RefreshButton
//                 onRefresh={this.props.onRefreshPageData}
//                 className={cx(styles['refresh'], 'refresh')}
//               />}
//           </TableCell>
//       //   </TableRow>
//       // </TableFooter>
//     );
//   }
// }
// PaginatedTableFooter.muiName = 'TableFooter';

