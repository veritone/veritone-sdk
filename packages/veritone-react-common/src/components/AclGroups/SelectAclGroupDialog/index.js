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
import { debounce, isEqual } from 'lodash';
import { string, arrayOf, func, shape } from 'prop-types';
import styles from './styles.scss';

export default class SelectAclGroupDialog extends Component {
  static propTypes = {
    acls: arrayOf(
      shape({
        organizationId: string.isRequired,
        permission: string.isRequired
      })
    ),
    organizations: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ).isRequired,
    defaultPermission: string.isRequired,
    onAdd: func,
    onClose: func
  };

  state = {
    selectedAcls: this.props.acls || [],
    organizationsView: this.props.organizations || [],
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
      organizationsView: this.props.organizations.filter(organization =>
        organization.name.toLowerCase().includes(searchTextLowerCase)
      )
    });
  };

  isSelectedOrganization = organizationId => {
    return this.state.selectedAcls.some(
      acl => acl.organizationId === organizationId
    );
  };

  handleSelectAclGroup = organizationId => {
    const { defaultPermission } = this.props;
    const { selectedAcls } = this.state;
    const selectedIndex = selectedAcls.findIndex(
      acl => acl.organizationId === organizationId
    );
    let newSelectedAcls = [];
    if (selectedIndex === -1) {
      newSelectedAcls = newSelectedAcls.concat(selectedAcls, {
        organizationId: organizationId,
        permission: defaultPermission
      });
    } else if (selectedIndex === 0) {
      newSelectedAcls = newSelectedAcls.concat(selectedAcls.slice(1));
    } else if (selectedIndex === selectedAcls.length - 1) {
      newSelectedAcls = newSelectedAcls.concat(selectedAcls.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedAcls = newSelectedAcls.concat(
        selectedAcls.slice(0, selectedIndex),
        selectedAcls.slice(selectedIndex + 1)
      );
    }
    this.setState({ selectedAcls: newSelectedAcls });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  hasPendingChanges = () => {
    return !isEqual(
      this.state.selectedAcls.map(acl => acl.organizationId).sort(),
      this.props.acls.map(acl => acl.organizationId).sort()
    );
  };

  handleAddButtonClick = () => {
    this.props.onAdd(this.state.selectedAcls);
  };

  render() {
    const { onClose } = this.props;

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
        aria-labelledby='add-acl-groups-dialog'
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
              id='search'
              type='search'
              placeholder='Filter by name'
              className={styles.dialogTitleSearchInput}
              value={searchText}
              onChange={this.onSearchTextChange}
            />
            <div className={styles.dialogTitleSeparator} />
            <IconButton onClick={onClose} aria-label='Close'>
              <Icon className='icon-close-exit' />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className={styles.aclsViewSection}>
            <Table className={styles.aclsTable} aria-labelledby='tableTitle'>
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
                          this.handleSelectAclGroup(organization.id)
                        }
                        role='checkbox'
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={organization.id}
                        selected={isSelected}
                      >
                        <TableCell
                          padding='checkbox'
                          classes={{
                            paddingCheckbox: styles.tableCheckboxCell
                          }}
                        >
                          <Checkbox checked={isSelected} color='primary' />
                        </TableCell>
                        <TableCell component='th' scope='row' padding='none'>
                          {organization.name}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            component='div'
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
        </DialogContent>
        <DialogActions
          classes={{
            root: styles.selectAclGroupActionButtons,
            action: styles.selectAclGroupActionButton
          }}
        >
          <Button onClick={onClose} color='primary'>
            Cancel
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={this.handleAddButtonClick}
            disabled={!this.hasPendingChanges()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
