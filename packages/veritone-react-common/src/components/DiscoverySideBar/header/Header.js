import React from 'react';
import { arrayOf, string, element, func, bool } from 'prop-types';
import { withStyles } from 'helpers/withStyles';
import MultipleTabHeader from './MuitipleTabHeader';
import SingleTabHeader from './SingleTabHeader';
import styles from './styles';

const classes = withStyles(styles);
class DiscoverySidebarHeader extends React.Component {
  static propTypes = {
    tabs: arrayOf(string).isRequired,
    selectedTab: string.isRequired,
    rightIconButton: bool,
    rightIconButtonElement: element,
    onSelectTab: func.isRequired
  };

  render() {
    return (
      <div className={classes.container}>
        {this.props.tabs.length > 1 ? (
          <div className={classes.multiTabsContainer}>
            <MultipleTabHeader
              tabs={this.props.tabs}
              selectedTab={this.props.selectedTab}
              onSelectTab={this.props.onSelectTab}
            />
          </div>
        ) : (
            <div className={classes.singleTabContainer}>
              <SingleTabHeader tab={this.props.tabs[0]} />
            </div>
          )}
        {this.props.rightIconButton && (
          <div className={classes.rightIconButtonContainer}>
            {this.props.rightIconButtonElement}
          </div>
        )}
      </div>
    );
  }
}

export default DiscoverySidebarHeader;
