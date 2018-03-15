import React from 'react';
import { arrayOf, string, element, func, bool } from 'prop-types';
import MultipleTabHeader from './MuitipleTabHeader';
import SingleTabHeader from './SingleTabHeader';
import styles from './styles.scss';

export default class NavigationSideBarHeader extends React.Component {
  static propTypes = {
    tabs: arrayOf(string).isRequired,
    selectedTab: string.isRequired,
    rightIconButton: bool,
    rightIconButtonElement: element,
    onSelectTab: func.isRequired
  };

  render() {
    return (
      <div className={styles.container}>
        {this.props.tabs.length > 1 ? (
          <div className={styles.multiTabsContainer}>
            <MultipleTabHeader
              tabs={this.props.tabs}
              selectedTab={this.props.selectedTab}
              onSelectTab={this.props.onSelectTab}
            />
          </div>
        ) : (
          <div className={styles.singleTabContainer}>
            <SingleTabHeader tab={this.props.tabs[0]} />
          </div>
        )}
        {this.props.rightIconButton && (
          <div className={styles.rightIconButtonContainer}>
            {this.props.rightIconButtonElement}
          </div>
        )}
      </div>
    );
  }
}
