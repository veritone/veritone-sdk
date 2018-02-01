import React from 'react';
import { arrayOf, string, func } from 'prop-types';
import Tabs, { Tab } from 'material-ui/es/Tabs';
import styles from './styles.scss';

const MultipleTabHeader = ({ tabs, selectedTab, onSelectTab }) => {
  return (
    <Tabs
      value={selectedTab}
      onChange={onSelectTab}
      indicatorColor="primary"
      textColor="primary"
      classes={{
        flexContainer: styles.muiTabsFlexContainerOverride
      }}
      fullWidth
    >
      {tabs.map(t => (
        <Tab
          classes={{
            root: styles.muiTabButtonRootOverride,
            label: styles.muiTabButtonLabelOverride
          }}
          value={t}
          label={t}
          key={t}
        />
      ))}
    </Tabs>
  );
};

MultipleTabHeader.propTypes = {
  tabs: arrayOf(string).isRequired,
  selectedTab: string.isRequired,
  onSelectTab: func.isRequired
};

export default MultipleTabHeader;
