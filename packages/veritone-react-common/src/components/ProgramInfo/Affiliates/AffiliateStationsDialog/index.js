import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { debounce, get, slice } from 'lodash';
import { func } from 'prop-types';
import EditAffiliateDialog from '../EditAffiliateDialog';
import styles from './styles.scss';

export default class AffiliateStationsDialog extends Component {
  static propTypes = {
    loadNextAffiliates: func.isRequired,
    onAdd: func.isRequired,
    onClose: func.isRequired
  };

  state = {
    affiliatesView: [],
    isLoading: false,
    hasNexPage: true,
    selectedAffiliate: null,
    searchText: '',
    page: 0,
    rowsPerPage: 10
  };

  componentDidMount() {
    this.fetchAffiliates(this.state.rowsPerPage, 0);
  }

  onSearchTextChange = event => {
    const searchText = event.target.value ? event.target.value : '';
    this.setState({
      searchText: searchText,
      page: 0,
      hasNexPage: true
    });
    this.handleSearchWithDebounce(searchText);
  };

  handleSearchWithDebounce = debounce(
    searchText => this.handleSearch(searchText),
    500
  );

  handleSearch = searchText => {
    const searchTextLowerCase = searchText.toLowerCase();
    this.fetchAffiliates(this.state.rowsPerPage, 0, searchTextLowerCase);
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

  onPreviousPage = () => {
    this.setState(prevState => {
      const page = prevState.page - 1;
      const searchTextLowerCase = prevState.searchText.toLowerCase();
      this.fetchAffiliates(
        prevState.rowsPerPage,
        page * prevState.rowsPerPage,
        searchTextLowerCase
      );
      return {
        page,
        hasNexPage: true
      };
    });
  };

  onNextPage = () => {
    this.setState(prevState => {
      const page = prevState.page + 1;
      const searchTextLowerCase = prevState.searchText.toLowerCase();
      this.fetchAffiliates(
        prevState.rowsPerPage,
        page * prevState.rowsPerPage,
        searchTextLowerCase
      );
      return {
        page
      };
    });
  };

  fetchAffiliates = (limit, offset, nameSearchText) => {
    this.setState({
      isLoading: true
    });
    const fetchLimit = limit + 1;
    this.props
      .loadNextAffiliates({ limit: fetchLimit, offset, nameSearchText })
      .then(affiliateResults => {
        if (affiliateResults && affiliateResults.length) {
          this.setState({
            affiliatesView: slice(affiliateResults, 0, limit),
            isLoading: false,
            hasNexPage: affiliateResults.length === fetchLimit
          });
        } else {
          this.setState({
            affiliatesView: [],
            isLoading: false,
            hasNexPage: false
          });
        }
        return;
      });
  };

  render() {
    const { onClose } = this.props;

    const {
      searchText,
      affiliatesView,
      page,
      rowsPerPage,
      selectedAffiliate,
      hasNexPage,
      isLoading
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
                    {affiliatesView.map(affiliate => {
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
                <div className={styles.affiliatesViewPaginationLabel}>
                  {page * rowsPerPage + 1} -{' '}
                  {page * rowsPerPage + affiliatesView.length}
                </div>
                <IconButton
                  aria-label="Previous Page"
                  disabled={page === 0 || isLoading}
                  onClick={this.onPreviousPage}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  aria-label="Next Page"
                  disabled={!hasNexPage || isLoading}
                  onClick={this.onNextPage}
                >
                  <ChevronRightIcon />
                </IconButton>
              </div>
            )}
            {!get(affiliatesView, 'length') &&
              !isLoading && (
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
