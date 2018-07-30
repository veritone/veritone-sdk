import React, { Component } from 'react';
import Icon from '@material-ui/core/Icon';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import { func, string, arrayOf, any } from 'prop-types';
import withMuiThemeProvider from '../../helpers/withMuiThemeProvider';
import styles from './styles.scss';

@withMuiThemeProvider
export default class EngineCategorySelector extends Component {
  static propTypes = {
    engineCategories: arrayOf(any),
    selectedEngineCategoryId: string,
    onSelectEngineCategory: func
  };

  handleTabChange = (event, value) => {
    this.props.onSelectEngineCategory(value);
  };

  render() {
    return (
      (this.props.engineCategories &&
        this.props.engineCategories.length &&
        this.props.selectedEngineCategoryId && (
          <div className={styles.engineCategoryTabsContainer}>
            <Tabs
              value={this.props.selectedEngineCategoryId}
              indicatorColor="primary"
              onChange={this.handleTabChange}
              classes={{
                flexContainer: styles.engineCategoryTabs,
                root: styles.engineCategoryTabsRoot,
                scroller: styles.engineCategoryTabsScroller
              }}
            >
              {this.props.engineCategories.map(function(engineCategory) {
                return (
                  <Tab
                    value={engineCategory.id}
                    key={engineCategory.id}
                    icon={
                      <Tooltip
                        id={engineCategory.name}
                        title={engineCategory.name}
                        classes={{
                          tooltip: styles.categoryTabTooltip
                        }}
                      >
                        <Icon
                          className={engineCategory.iconClass}
                          classes={{ root: styles.categoryIcon }}
                        />
                      </Tooltip>
                    }
                    classes={{
                      root: styles.engineCategoryTab,
                      selected: styles.engineCategoryTabSelectedColor
                    }}
                  />
                );
              })}
            </Tabs>
          </div>
        )) ||
      null
    );
  }
}
