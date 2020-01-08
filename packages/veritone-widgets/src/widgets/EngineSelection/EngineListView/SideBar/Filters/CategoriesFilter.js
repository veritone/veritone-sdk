import React from 'react';
import { connect } from 'react-redux';
import { func, arrayOf, string, shape, bool, any } from 'prop-types';
import { without, sortBy } from 'lodash';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/styles';
import { modules } from 'veritone-redux-common';
const { engine: engineModule } = modules;

import FailureScreen from '../../EngineListContainer/FailureScreen';
import styles from '../styles';

@withStyles(styles)
@connect(
  (state, { id }) => ({
    engineCategories: engineModule.getEngineCategories(state),
    isFetchingEngineCategories: engineModule.isFetchingEngineCategories(state),
    failedToFetchEngineCategories: engineModule.failedToFetchEngineCategories(
      state
    )
  }),
  {
    fetchEngineCategories: engineModule.fetchEngineCategories
  }
)
class CategoriesFilter extends React.Component {
  static propTypes = {
    id: string.isRequired,
    filters: shape({
      category: arrayOf(string).isRequired
    }).isRequired,
    filterBy: func.isRequired,
    engineCategories: arrayOf(
      shape({
        name: string.isRequired
      })
    ),
    fetchEngineCategories: func.isRequired,
    isFetchingEngineCategories: bool.isRequired,
    failedToFetchEngineCategories: bool.isRequired,
    classes: shape({ any }),
  };

  addCategory = category => {
    this.props.filterBy(this.props.id, {
      type: 'category',
      value: [...this.props.filters.category, category]
    });
  };

  removeCategory = category => {
    this.props.filterBy(this.props.id, {
      type: 'category',
      value: without(this.props.filters.category, category)
    });
  };

  handleClick = category => {
    if (
      this.props.filters.category &&
      this.props.filters.category.includes(category)
    ) {
      this.removeCategory(category);
    } else {
      this.addCategory(category);
    }
  };

  handleRefetchCategories = () => {
    this.props.fetchEngineCategories();
  };

  render() {
    const { classes } = this.props;
    if (this.props.isFetchingEngineCategories) {
      return (
        <div className={classes.isFetching}>
          <CircularProgress size={50} />
        </div>
      );
    }

    if (this.props.failedToFetchEngineCategories) {
      return (
        <FailureScreen
          message="Failed to fetch categories."
          classes={{
            errorOutlineIcon: {
              root: classes.failedToFetchIcon
            },
            message: {
              root: classes.failedToFetchMessage
            }
          }}
          onRetry={this.handleRefetchCategories}
        />
      );
    }

    return (
      <div className={classes.filterContainer}>
        <div>
          {sortBy(this.props.engineCategories, ['name']).map(category => (
            <div key={category.name}>
              <div className={classes.inlineFilter}>
                <Checkbox
                  color="primary"
                  classes={{ root: classes.checkbox }}
                  checked={this.props.filters.category.includes(category.name)}
                  onClick={() => this.handleClick(category.name)} // eslint-disable-line
                />
                {category.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default {
  label: 'Categories',
  id: 'categories',
  component: CategoriesFilter
};
