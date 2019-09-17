import React from 'react';
import { func, number, object, arrayOf } from 'prop-types';
import { format } from 'date-fns';

import { get } from 'lodash';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

import Dialog from '@material-ui/core/Dialog';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { ExpandableInputField } from 'veritone-react-common';
import { HorizontalScroll, SearchBar } from 'veritone-react-common';

import DeleteDialog from './delete';

import InfiniteScrollTable from './table';
import LoadingSpinner from './spinner';
import NoSearchProfiles from './noSearchProfiles';

import styles from '../styles.scss';

class LoadSavedSearch extends React.Component {
  static propTypes = {
    mySearchProfiles: arrayOf(object),
    loadedMySearchProfiles: object,
    mySearchProfilesCount: number,
    orgSavedProfiles: object,
    onClose: func,
    onLoadSavedSearch: func,
    deleteSearchProfile: func,
    resetSearchProfiles: func,
    user: object
  };

  static TABS = {
    0: 'My Search Profiles',
    1: 'Org Search Profiles'
  };

  state = {
    selectedTab: 0,
    searchByProfileName: {
      0: '',
      1: ''
    },
    confirmDelete: false,
    orgSearchProfileScrollBarSize: 0,
    mySearchProfileScrollBarSize: 0
  };

  selectTab = (evt, value) => {
    this.setState({ selectedTab: value });
  };

  resetSearchInput = e => {
    if (this.state.selectedTab === 0) {
      this.props.loadSearchProfiles({
        searchByProfileName: '',
        limit: 20,
        offset: 0,
        shared: false
      });
    } else if (this.state.selectedTab === 1) {
      this.props.loadSearchProfiles({
        searchByProfileName: '',
        limit: 20,
        offset: 0,
        shared: true
      });
    }

    this.setState(prevState => ({
      searchByProfileName: {
        ...prevState.searchByProfileName,
        [prevState.selectedTab]: ''
      }
    }));
  };

  onChangeSearchInput = e => {
    const newSearchValue = e.target.value;
    this.setState(prevState => ({
      searchByProfileName: {
        ...prevState.searchByProfileName,
        [prevState.selectedTab]: newSearchValue
      }
    }));
  };

  onSelectSavedSearch = csp => e => {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.onSelectSavedSearch) {
      this.props.onSelectSavedSearch(csp);
      if (this.props.onClose) {
        this.props.onClose();
      }
    }
  };

  onRenderOrgSearchProfiles = scrollBarSize => {
    // need to only call setState and force a rerender when the scrollbarsize changes
    if(this.state.orgSearchProfileScrollBarSize !== scrollBarSize) {
      this.setState({
        orgSearchProfileScrollBarSize: scrollBarSize
      });
    }
  };

  onRenderMySearchProfiles = scrollBarSize => {
    // need to only call setState and force a rerender when the scrollbarsize changes
    if(this.state.mySearchProfileScrollBarSize !== scrollBarSize) {
      this.setState({
        mySearchProfileScrollBarSize: scrollBarSize
      });
    };
  };

  cancelDelete = () => {
    this.setState({
      confirmDelete: false
    });
  };

  getConfirmDelete = (id, name) => e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      confirmDelete: { id, name }
    });
  };

  deleteProfile = async () => {
    let success = await this.props.deleteSearchProfile(this.state.confirmDelete, this.state.selectedTab);
    if(success) {
      this.props.resetMySearchProfile();

      this.searchMySearchProfiles();
    }
    // to do, add error display
    this.setState({
      confirmDelete: false
    });
  };

  isMySearchProfileRowLoaded = ({ index }) => {
    const record =
      this.props.mySearchProfiles && this.props.mySearchProfiles[index];
    return !!record;
  };

  isOrgSearchProfileRowLoaded = ({ index }) => {
    const record =
      this.props.orgSearchProfiles && this.props.orgSearchProfiles[index];
    return !!record;
  };

  searchMySearchProfiles = () => {
    const searchByProfileName = this.state.searchByProfileName[
      this.state.selectedTab
    ];
    this.props.loadSearchProfiles({
      sortBy: this.props.mySearchProfilesSortBy,
      sortDirection: this.props.mySearchProfilesSortDirection,
      searchByProfileName,
      limit: 20,
      offset: 0,
      shared: false
    });
  };

  searchOrgSearchProfiles = () => {
    const searchByProfileName = this.state.searchByProfileName[
      this.state.selectedTab
    ];
    this.props.loadSearchProfiles({
      sortBy: this.props.orgSearchProfilesSortBy,
      sortDirection: this.props.orgSearchProfilesSortDirection,
      searchByProfileName,
      limit: 20,
      offset: 0,
      shared: true
    });
  };

  sortMySearchProfiles = column => () => {
    let newSortDirection = this.props.mySearchProfilesSortDirection;
    if (this.props.mySearchProfilesSortDirection === 'asc') {
      newSortDirection = 'desc';
    } else {
      newSortDirection = 'asc';
    }

    this.props.loadSearchProfiles({
      sortBy: column,
      sortDirection: newSortDirection,
      searchByProfileName: this.props.mySearchProfilesFilterByName,
      limit: 20,
      offset: 0,
      shared: false
    });
  };

  sortOrgSearchProfiles = column => () => {
    let newSortDirection = this.props.orgSearchProfilesSortDirection;
    if (this.props.orgSearchProfilesSortDirection === 'asc') {
      newSortDirection = 'desc';
    } else {
      newSortDirection = 'asc';
    }

    this.props.loadSearchProfiles({
      sortBy: column,
      sortDirection: newSortDirection,
      searchByProfileName: this.props.orgSearchProfilesFilterByName,
      limit: 20,
      offset: 0,
      shared: true
    });
  };

  renderMySearchProfileRowSummary = index => {
    const record = this.props.mySearchProfiles[index];
    if (record && this.props.loadedMySearchProfiles.has(record.id)) {
      return (
        <div className={ styles.row }>
          <div style={{ flexBasis: '50%' }}>
            <Typography variant="body1">{record.name}</Typography>
          </div>
          <div style={{ flexBasis: '25%' }}>
            <Typography variant="body1">
              {record.sharedWithOrganization ? 'Yes' : 'No'}
            </Typography>
          </div>
          <div style={{ flexBasis: '20%' }}>
            <Typography variant="body1">
              {format(record.createdDateTime, 'MMM D, YYYY')}
            </Typography>
          </div>
          <div className={ styles.rowActions }>
            <a onClick={this.onSelectSavedSearch(record.csp)} data-veritone-element={`load_my_saved_search_${index}`}>
              <Typography color="primary">LOAD</Typography>
            </a>
            <IconButton onClick={this.getConfirmDelete(record.id, record.name)} data-veritone-element={`delete_my_saved_search_${index}`}>
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      );
    } else if (index) {
      return (
        <Typography variant="body1">{`Loading Row ${index} - ${JSON.stringify(
          record
        )}`}</Typography>
      );
    }
  };

  renderMySearchProfileRowDetails = index => {
    const record =
      this.props.mySearchProfiles && this.props.mySearchProfiles[index];
    if (record && this.props.loadedMySearchProfiles.has(record.id)) {
      return (
        <HorizontalScroll
          leftScrollButton={<KeyboardArrowLeft />}
          rightScrollButton={<KeyboardArrowRight />}
        >
          <SearchBar csp={record.csp} />
        </HorizontalScroll>
      );
    }
  };

  renderOrgSearchProfileRowDetails = index => {
    const record =
      this.props.orgSearchProfiles && this.props.orgSearchProfiles[index];
    if (record && this.props.loadedOrgSearchProfiles.has(record.id)) {
      return (
        <HorizontalScroll
          leftScrollButton={<KeyboardArrowLeft />}
          rightScrollButton={<KeyboardArrowRight />}
        >
          <SearchBar csp={record.csp} />
        </HorizontalScroll>
      );
    }
  };

  renderMySearchProfiles({ title, count, rows }) {
    if (count === null || count === undefined) {
      return (<Paper className={ styles.tabbedPaperContainer }><LoadingSpinner title={title} /></Paper>);
    } else if (count === 0 && !this.props.loadingMySearchProfiles) {
      return (<Paper className={ styles.tabbedPaperContainer }>
        <div style={{ textAlign: 'right', padding: '0.5em' }}>
          { this.props.mySearchProfilesFilterByName && this.props.mySearchProfilesFilterByName.trim().length > 0 &&
            <ExpandableInputField
              expandedInputProps={{
                style: { minWidth: '20vw' },
                'data-veritone-element': 'search_my_profiles'
              }}
              dataTag={'search_my_profiles'}
              icon={<SearchIcon />}
              value={this.state.searchByProfileName[this.state.selectedTab]}
              onChange={this.onChangeSearchInput}
              onSearch={this.searchMySearchProfiles}
              onReset={this.resetSearchInput}
            />
          }
        </div>
        <NoSearchProfiles /></Paper>);
    } else {
      return (
        <Paper className={ styles.tabbedPaperContainer }>
          <div style={{ textAlign: 'right', paddingTop: '0.5em' }}>
            <ExpandableInputField
              expandedInputProps={{
                style: { minWidth: '20vw' },
                'data-veritone-element': 'search_my_profiles'
              }}
              icon={<SearchIcon />}
              value={this.state.searchByProfileName[this.state.selectedTab]}
              onChange={this.onChangeSearchInput}
              onSearch={this.searchMySearchProfiles}
              onReset={this.resetSearchInput}
            />
          </div>
          <div className={ styles.tableHeader } style={ {paddingRight: this.state.mySearchProfileScrollBarSize } }>
            <div style={{ flexBasis: '50%' }}>
              <TableSortLabel
                data-veritone-element="sort_by_my_profile_name"
                active={'name' === this.props.mySearchProfilesSortBy}
                direction={this.props.mySearchProfilesSortDirection}
                onClick={this.sortMySearchProfiles('name')}
              >
                <Typography variant="body2">Profile Name</Typography>
              </TableSortLabel>
            </div>
            <div style={{ flexBasis: '25%' }}>
              <TableSortLabel
                data-veritone-element="sort_by_my_profile_shared"
                active={
                  'sharedWithOrganization' === this.props.mySearchProfilesSortBy
                }
                direction={this.props.mySearchProfilesSortDirection}
                onClick={this.sortMySearchProfiles('sharedWithOrganization')}
              >
                <Typography variant="body2">Shared with Org</Typography>
              </TableSortLabel>
            </div>
            <div style={{ flexBasis: '20%' }}>
              <TableSortLabel
                data-veritone-element="sort_by_my_profile_created_date"
                active={'createdDateTime' === this.props.mySearchProfilesSortBy}
                direction={this.props.mySearchProfilesSortDirection}
                onClick={this.sortMySearchProfiles('createdDateTime')}
              >
                <Typography variant="body2">Created Date</Typography>
              </TableSortLabel>
            </div>
            <div
              style={{
                flex: '0 0 125px',
                alignItems: 'center',
                display: 'flex'
              }}
            />
          </div>
          <div
            style={{ display: 'flex', flex: 1, marginRight: '2px' }}
          >
            <InfiniteScrollTable
              rowClassName={ styles.infiniteRow }
              lastRowClassName={ styles.lastRow }
              className={ styles.infiniteTable }
              ref={ mySearchProfilesTable => this._mySearchProfilesTable = mySearchProfilesTable }
              count={this.props.mySearchProfilesCount}
              rows={rows}
              isRowLoaded={this.isMySearchProfileRowLoaded}
              loadMoreRows={this.props.loadMoreMySearchProfiles}
              onRenderList={this.onRenderMySearchProfiles}
              renderRowSummary={this.renderMySearchProfileRowSummary}
              renderRowDetails={this.renderMySearchProfileRowDetails}
            />
          </div>
        </Paper>
      );
    }
  }

  renderOrgSearchProfileRowSummary = index => {
    const record =
      this.props.orgSearchProfiles && this.props.orgSearchProfiles[index];
    if (record && this.props.loadedOrgSearchProfiles.has(record.id)) {
      return (
        <div className={ styles.row}>
          <div style={{ flexBasis: '40%' }}>
            <Typography variant="body1">{record.name}</Typography>
          </div>
          <div style={{ flexBasis: '35%' }}>
            <Typography variant="body1">{get(record, 'owner.name')}</Typography>
          </div>
          <div style={{ flexBasis: '20%' }}>
            <Typography variant="body1">
              {format(record.createdDateTime, 'MMM D, YYYY')}
            </Typography>
          </div>
          <div className={styles.rowActions} data-veritone-element={`load_org_saved_search_${index}`}>
            <a onClick={this.onSelectSavedSearch(record.csp)}>
              <Typography color="primary">LOAD</Typography>
            </a>
          </div>
        </div>
      );
    } else if (index) {
      return <Typography variant="body1">{`Loading Row ${index}`}</Typography>;
    }
  };

  renderOrgSearchProfiles({ title, count, rows }) {
    if (count === null || count === undefined) {
      return (<Paper className={styles.tabbedPaperContainer}><LoadingSpinner title={title} /></Paper>);
    } else if (count === 0 && !this.props.loadingOrgSearchProfiles) {
      return (<Paper className={styles.tabbedPaperContainer}>
        <div style={{ textAlign: 'right', paddingTop: '0.5em' }}>
          { this.props.orgSearchProfilesFilterByName && this.props.orgSearchProfilesFilterByName.trim().length > 0 && <ExpandableInputField
            expandedInputProps={{
              style: { minWidth: '20vw' },
              'data-veritone-element': 'search_org_profiles'
            }}
            icon={<SearchIcon />}
            value={this.state.searchByProfileName[this.state.selectedTab]}
            onChange={this.onChangeSearchInput}
            onSearch={this.searchOrgSearchProfiles}
            onReset={this.resetSearchInput}
          />
          }
        </div>
        <NoSearchProfiles /></Paper>);
    } else {
      return (
        <Paper className={styles.tabbedPaperContainer}>
          <div style={{ textAlign: 'right', paddingTop: '0.5em' }}>
            <ExpandableInputField
              dataTag="search_org_profiles"
              expandedInputProps={{
                style: { minWidth: '20vw' },
                'data-veritone-element': 'search_org_profiles'
              }}
              icon={<SearchIcon />}
              value={this.state.searchByProfileName[this.state.selectedTab]}
              onChange={this.onChangeSearchInput}
              onSearch={this.searchOrgSearchProfiles}
              onReset={this.resetSearchInput}
            />
          </div>
          <div className={styles.tableHeader} style={ {paddingRight: this.state.orgSearchProfileScrollBarSize } }>
            <div style={{ flexBasis: '40%' }}>
              <TableSortLabel
                data-veritone-element="sort_by_org_profile_name"
                active={'name' === this.props.orgSearchProfilesSortBy}
                direction={this.props.orgSearchProfilesSortDirection}
                onClick={this.sortOrgSearchProfiles('name')}
              >
                <Typography variant="body2">Profile Name</Typography>
              </TableSortLabel>
            </div>
            <div style={{ flexBasis: '35%' }}>
              <Typography variant="body2">Created By</Typography>
            </div>
            <div style={{ flexBasis: '20%' }}>
              <TableSortLabel
                data-veritone-element="sort_by_org_created_date"
                active={
                  'createdDateTime' === this.props.orgSearchProfilesSortBy
                }
                direction={this.props.orgSearchProfilesSortDirection}
                onClick={this.sortOrgSearchProfiles('createdDateTime')}
              >
                <Typography variant="body2">Created Date</Typography>
              </TableSortLabel>
            </div>
            <div
              style={{
                flex: '0 0 125px',
                alignItems: 'center',
                display: 'flex'
              }}
            />
          </div>
          <div
            style={{ display: 'flex', flex: 1, marginRight: '2px' }}
          >
            <InfiniteScrollTable
              rowClassName={ styles.infiniteRow }
              lastRowClassName={ styles.lastRow }
              className={ styles.infiniteTable }
              ref={ orgSearchProfilesTable => this._orgSearchProfilesTable = orgSearchProfilesTable }
              count={this.props.orgSearchProfilesCount}
              rows={rows}
              isRowLoaded={this.isOrgSearchProfileRowLoaded}
              loadMoreRows={this.props.loadMoreOrgSearchProfiles}
              onRenderList={this.onRenderOrgSearchProfiles}
              renderRowSummary={this.renderOrgSearchProfileRowSummary}
              renderRowDetails={this.renderOrgSearchProfileRowDetails}
            />
          </div>
        </Paper>
      );
    }
  }

  render() {
    return (
      <Card style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
        <CardHeader
          action={
            <IconButton onClick={this.props.onClose} data-veritone-element="cancel_load_profile">
              <CloseIcon />
            </IconButton>
          }
          title="Load Search Profile"
          subheader="Use search profiles saved by you or your organization to quickly find what you need."
        />
        <CardContent style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Tabs
            value={this.state.selectedTab}
            onChange={this.selectTab}
            indicatorColor="primary"
          >
            <Tab
              label={`${LoadSavedSearch.TABS[0]} (${this.props
                .mySearchProfilesCount || 0}) `}
              data-veritone-element={`my_search_profile_tab`}
            />
            <Tab
              label={`${LoadSavedSearch.TABS[1]} (${this.props
                .orgSearchProfilesCount || 0}) `}
              data-veritone-element={`org_search_profile_tab`}
            />
          </Tabs>
          <div style={{ flex: 1, display: 'flex' }}>
            {this.state.selectedTab === 0 &&
              this.renderMySearchProfiles({
                title: LoadSavedSearch.TABS[this.state.selectedTab],
                count: this.props.mySearchProfilesCount,
                rows: this.props.mySearchProfiles
              })}
            {this.state.selectedTab === 1 &&
              this.renderOrgSearchProfiles({
                title: LoadSavedSearch.TABS[this.state.selectedTab],
                count: this.props.orgSearchProfilesCount,
                rows: this.props.orgSearchProfiles
              })}
          </div>
          <Dialog open={!!this.state.confirmDelete}>
            <DeleteDialog
              onClose={this.cancelDelete}
              onDelete={this.deleteProfile}
              searchProfileName={this.state.confirmDelete.name}
            />
          </Dialog>
        </CardContent>
        <CardActions style={{ flexDirection: 'row-reverse' }}>
          <Button color="primary" onClick={ this.props.onClose } data-veritone-element="cancel_load_profile_button">
            Cancel
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default (LoadSavedSearch);
