import React, { Fragment } from 'react';
import {
  string,
  func,
  arrayOf,
  shape,
  number,
  objectOf,
  element,
  object
} from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import styles from './styles/container.scss';
import Header from './header/Header';
import SectionTree, { sectionsShape } from './SectionTree';

// todo:
// figure out how state will come from redux-form and how to transform that
// into filters counts for each section/subsection

// figure out how callbacks from clear-filters at various levels will clear
// the associated redux-form state (by <Field> name/id?)

// animations

export { sectionsShape } from './SectionTree';

export class DiscoverySideBarContainerPure extends React.Component {
  static propTypes = {
    formComponents: objectOf(element).isRequired,
    filtersSections: sectionsShape.isRequired,
    selectedFilters: arrayOf(object), // see AllFiltersList.filters
    onClick: func,
    closeFilter: func,
    checkboxCount: shape({object
    }),
    onCheckBoxChange: func,

    // provided by wrapper:
    tabs: arrayOf(string).isRequired,
    selectedTab: string.isRequired,
    onSelectTab: func.isRequired,
    filtersActivePath: arrayOf(number),
  };
  static defaultProps = {
    selectedFilters: [],
  };

  handleApplyFilter = event => {
    const selectedItems = event.target.getAttribute('data-filters');
    this.props.onClick(JSON.parse(selectedItems))
  }

  handleCheckBoxChange = (event, checked) => {
    console.log(event.target.id, checked);
  }
  
  render() {
    return (
      <div className={styles.container}>
        <Header
          tabs={this.props.tabs}
          selectedTab={this.props.selectedTab}
          rightIconButtonElement={
            <IconButton onClick={this.props.closeFilter}>
              <Close />
            </IconButton>
          }
          onSelectTab={this.props.onSelectTab}
        />
        {<Fragment>
          <SectionTree
            // todo: add filters
            sections={this.props.filtersSections}
            activePath={this.props.filtersActivePath}
            formComponents={this.props.formComponents}
            checkboxCount={this.props.checkboxCount}
            onCheckboxChange={this.props.onCheckboxChange}
            />
          <div className={styles.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              style={{fontWeight: 500, width: '300px', backgroundColor: '#2196F3'}}
              data-filters={JSON.stringify(this.props.selectedFilters)}
              onClick={this.handleApplyFilter}
            >
              Apply Filter
            </Button>
          </div>
        </Fragment>}
      </div>
    );
  }
}

// state provider for top level sidebar state-- selected tabs, sections etc.
export default class DiscoverySideBarContainer extends React.Component {
  static propTypes = {
    tabs: arrayOf(string)
  };

  static defaultProps = {
    tabs: ['Filters']
  };

  state = {
    selectedTab: this.props.tabs[0],
  };

  handleSelectTab = (_, tab) => {
    this.setState({ selectedTab: tab });
  };

  render() {
    return (
      <DiscoverySideBarContainerPure
        {...this.props}
        selectedTab={this.state.selectedTab}
        onSelectTab={this.handleSelectTab}
      />
    );
  }
}
