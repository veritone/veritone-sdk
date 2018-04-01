import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import Icon from 'material-ui/Icon';
import { func, string, arrayOf, any } from 'prop-types';
import styles from './styles.scss';

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
                flexContainer: styles.engineCategoryTabs
              }}
            >
              {this.props.engineCategories.map(function(engineCategory) {
                return (
                  <Tab
                    value={engineCategory.id}
                    key={engineCategory.id}
                    icon={
                      <Icon
                        className={engineCategory.iconClass.replace(
                          '-engine',
                          ''
                        )}
                        classes={{ root: styles.categoryIcon }}
                      />
                    }
                    classes={{
                      root: styles.engineCategoryTab
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
