import React from 'react';
import { arrayOf, string, func } from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/styles';
import styles from './styles';

const useStyles = makeStyles(styles);
const MultipleTabHeader = ({ tabs, selectedTab, onSelectTab }) => {
  const classes = useStyles();
  return (
    <Tabs
      value={selectedTab}
      onChange={onSelectTab}
      indicatorColor="primary"
      textColor="primary"
      classes={{
        flexContainer: classes.muiTabsFlexContainerOverride
      }}
    >
      {tabs.map(t => (
        <Tab
          classes={{
            root: classes.muiTabButtonRootOverride
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
