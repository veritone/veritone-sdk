import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { debounce, get } from 'lodash';
import { string, arrayOf, func, shape } from 'prop-types';
import EditAffiliateDialog from '../EditAffiliateDialog';
import styles from './styles.scss';

export default class AffiliateStationsDialog extends Component {
  static propTypes = {
    affiliates: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ),
    onAdd: func,
    onClose: func
  };

  static defaultProps = {
    affiliates: []
  };

  state = {
    affiliatesView: this.props.affiliates || [],
    selectedAffiliate: null,
    searchText: '',
    page: 0,
    rowsPerPage: 10,
    rowsPerPageOptions: []
  };

  onSearchTextChange = event => {
    const searchText = event.target.value ? event.target.value : '';
    this.setState({
      searchText: searchText,
      page: 0
    });
    this.handleSearchWithDebounce(searchText);
  };

  handleSearchWithDebounce = debounce(
    searchText => this.handleSearch(searchText),
    300
  );

  handleSearch = searchText => {
    const searchTextLowerCase = searchText.toLowerCase();
    this.setState({
      affiliatesView: this.props.affiliates.filter(affiliate =>
        affiliate.name.toLowerCase().includes(searchTextLowerCase)
      )
    });
  };

  handleSelectAffiliate = affiliate => {
    this.setState({
      selectedAffiliate: {
        ...affiliate
      }
    });
  };

  closeEditAffiliateDialog = () => {
    this.setState({
      selectedAffiliate: null
    });
  };

  handleSaveAffiliate = affiliate => {
    this.closeEditAffiliateDialog();
    this.props.onAdd(affiliate);
    this.props.onClose();
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  render() {
    const { onClose } = this.props;

    const {
      searchText,
      affiliatesView,
      page,
      rowsPerPage,
      rowsPerPageOptions,
      selectedAffiliate
    } = this.state;

    return (
      <div>
        <Dialog
          open
          onClose={onClose}
          disableBackdropClick
          aria-labelledby="add-affiliates-dialog"
          classes={{
            paper: styles.addAffiliatesDialogPaper
          }}
        >
          <DialogTitle
            classes={{
              root: styles.dialogTitle
            }}
          >
            <div>Affiliated Stations</div>
            <div className={styles.dialogTitleActions}>
              <TextField
                id="search"
                type="search"
                placeholder="Filter by name"
                className={styles.dialogTitleSearchInput}
                value={searchText}
                onChange={this.onSearchTextChange}
              />
              <div className={styles.dialogTitleSeparator} />
              <IconButton onClick={onClose} aria-label="Close">
                <Icon className="icon-close-exit" />
              </IconButton>
            </div>
          </DialogTitle>
          <DialogContent
            classes={{
              root: styles.dialogContent
            }}
          >
            {get(affiliatesView, 'length') > 0 && (
              <div className={styles.affiliatesViewSection}>
                <Table
                  className={styles.affiliatesTable}
                  aria-labelledby="tableTitle"
                >
                  <TableBody>
                    {affiliatesView
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map(affiliate => {
                        return (
                          /* eslint-disable react/jsx-no-bind */
                          <TableRow hover tabIndex={-1} key={affiliate.id}>
                            <TableCell
                              scope="row"
                              padding="none"
                              classes={{
                                body: styles.nameCell
                              }}
                            >
                              <div className={styles.nameCellContent}>
                                <div>{affiliate.name}</div>
                                <div className={styles.selectAffiliateButton}>
                                  <Button
                                    color="primary"
                                    onClick={() =>
                                      this.handleSelectAffiliate(affiliate)
                                    }
                                  >
                                    SELECT
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            )}
            {get(affiliatesView, 'length') > 0 && (
              <div className={styles.affiliatesViewPagination}>
                <TablePagination
                  component="div"
                  count={affiliatesView.length}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  backIconButtonProps={{
                    'aria-label': 'Previous Page'
                  }}
                  nextIconButtonProps={{
                    'aria-label': 'Next Page'
                  }}
                  onChangePage={this.handleChangePage}
                  rowsPerPageOptions={rowsPerPageOptions}
                />
              </div>
            )}
            {!get(affiliatesView, 'length') && (
              <div className={styles.noResultsMessage}>No Results</div>
            )}
          </DialogContent>
          <DialogActions
            classes={{
              root: styles.actionButtons,
              action: styles.actionButton
            }}
          >
            <Button
              onClick={onClose}
              classes={{
                label: styles.actionButtonLabel
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        {selectedAffiliate && (
          <EditAffiliateDialog
            affiliate={selectedAffiliate}
            onClose={this.closeEditAffiliateDialog}
            onSave={this.handleSaveAffiliate}
          />
        )}
      </div>
    );
  }
}
