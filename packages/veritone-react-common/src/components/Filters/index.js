import React, { Fragment } from 'react';
import {
  func,
  arrayOf,
  shape,
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
// clean up components so there is only one container for Filters

export { sectionsShape } from './SectionTree';

export default class FiltersContainer extends React.Component {
  static propTypes = {
    formComponents: objectOf(element).isRequired,
    filtersSections: sectionsShape.isRequired,
    selectedFilters: arrayOf(object), // see AllFiltersList.filters
    onClick: func,
    closeFilter: func,
    checkboxCount: shape({object
    }),
    onCheckboxChange: func,
  };
  static defaultProps = {
    selectedFilters: [],
  };

  handleApplyFilter = event => {
    const selectedItems = event.target.getAttribute('data-filters');
    this.props.onClick(JSON.parse(selectedItems))
  }
  
  render() {
    return (
      <div className={styles.container}>
        <Header
          rightIconButtonElement={
            <IconButton onClick={this.props.closeFilter}>
              <Close />
            </IconButton>
          }
        />
        {<Fragment>
          <SectionTree
            // todo: add filters
            sections={this.props.filtersSections}
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
