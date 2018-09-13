import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
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
import { debounce, get, values } from 'lodash';
import { string, objectOf, func, shape } from 'prop-types';
import styles from './styles.scss';

export default class SelectAclGroupDialog extends Component {
  static propTypes = {
    organizations: objectOf(
      shape({
        id: string.isRequired,
        name: string.isRequired,
        permission: string
      })
    ),
    defaultPermission: string.isRequired,
    onAdd: func,
    onClose: func
  };

  static defaultProps = {
    organizations: {}
  };

  state = {
    modifiedAcls: {},
    organizationsView: values(this.props.organizations) || [],
    searchText: '',
    page: 0,
    rowsPerPage: 10,
    rowsPerPageOptions: []
  };

  onSearchTextChange = event => {
    const searchText = event.target.value;
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
      organizationsView: values(this.props.organizations).filter(organization =>
        organization.name.toLowerCase().includes(searchTextLowerCase)
      )
    });
  };

  isSelectedOrganization = organizationId => {
    if (this.state.modifiedAcls[organizationId]) {
      // permission could have been added or removed
      return !!this.state.modifiedAcls[organizationId].permission;
    }
    return !!this.props.organizations[organizationId].permission;
  };

  handleAclGroupClick = organizationId => {
    const { defaultPermission, organizations } = this.props;
    this.setState(prevState => {
      const acls = { ...prevState.modifiedAcls };
      if (!acls[organizationId]) {
        if (organizations[organizationId].permission) {
          // clicked on selected org, so save change to remove permission
          acls[organizationId] = {
            ...organizations[organizationId]
          };
          acls[organizationId].permission = null;
        } else {
          // clicked on unselected org, so add a default permission
          acls[organizationId] = {
            ...organizations[organizationId],
            permission: defaultPermission
          };
        }
      } else {
        delete acls[organizationId];
      }
      return { modifiedAcls: acls };
    });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  hasPendingChanges = () => {
    return values(this.state.modifiedAcls).length > 0;
  };

  handleAddButtonClick = () => {
    this.props.onAdd({
      ...this.state.modifiedAcls
    });
    this.setState({ modifiedAcls: {} });
  };

  render() {
    const { onClose, organizations } = this.props;

    const {
      searchText,
      organizationsView,
      page,
      rowsPerPage,
      rowsPerPageOptions
    } = this.state;

    return (
      <Dialog
        open
        onClose={onClose}
        disableBackdropClick
        aria-labelledby="add-acl-groups-dialog"
        classes={{
          paper: styles.selectAclGroupDialogPaper
        }}
      >
        <DialogTitle
          classes={{
            root: styles.dialogTitle
          }}
        >
          <div>Select ACL Group</div>
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
          {get(organizationsView, 'length') > 0 && (
            <div className={styles.aclsViewSection}>
              <Table className={styles.aclsTable} aria-labelledby="tableTitle">
                <TableBody>
                  {organizationsView
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(organization => {
                      const isSelected = this.isSelectedOrganization(
                        organization.id
                      );
                      return (
                        /* eslint-disable react/jsx-no-bind */
                        <TableRow
                          hover
                          onClick={() =>
                            this.handleAclGroupClick(organization.id)
                          }
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={organization.id}
                          selected={isSelected}
                        >
                          <TableCell
                            padding="checkbox"
                            classes={{
                              paddingCheckbox: styles.tableCheckboxCell
                            }}
                          >
                            <Checkbox checked={isSelected} color="primary" />
                          </TableCell>
                          <TableCell
                            scope="row"
                            padding="none"
                            classes={{
                              body: styles.tableOrganizationNameCell
                            }}
                          >
                            {organization.name}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          )}
          {get(organizationsView, 'length') > 0 && (
            <div className={styles.aclsViewPagination}>
              <TablePagination
                component="div"
                count={organizationsView.length}
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
          {!get(organizationsView, 'length', 0) === 0 &&
            values(organizations).length > 0 && (
              <div className={styles.noResultsMessage}>No Results</div>
            )}
        </DialogContent>
        <DialogActions
          classes={{
            root: styles.selectAclGroupActionButtons,
            action: styles.selectAclGroupActionButton
          }}
        >
          <Button
            onClick={onClose}
            color="primary"
            classes={{
              label: styles.actionButtonLabel
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleAddButtonClick}
            disabled={!this.hasPendingChanges()}
            classes={{
              label: styles.actionButtonLabel
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
