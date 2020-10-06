import React from 'react';
import { bool, string, func, oneOfType, number, arrayOf, shape } from 'prop-types';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import DrawerBar from '../../templates/DrawerBar';
import Tabs from '../../molecules/Tabs';

import styles from './styles';

const useStyles = makeStyles(styles);

function SettingPanel({
  open,
  onClose,
  selectedTabId = 0,
  tabsList
}) {
  const classes = useStyles();
  const [tabId, setTabId] = React.useState(selectedTabId);
  React.useEffect(() => {
    if (selectedTabId !== tabId) {
      setTabId(selectedTabId);
    }
  }, [selectedTabId])
  function handleChangeTab(id) {
    setTabId(id);
  }
  function getTabLabel() {
    const currentTab = tabsList.find(item => item.id === tabId);
    return currentTab.label;
  }
  return (
    <DrawerBar open={open} onClose={onClose}>
      <Box display="flex" height="100%">
        <Box id="setting-content" width="375px" height="100%" className={classes.tabContainer}>
          <Box id="title" height="64px" width="100%" className={classes.tabName}>
            <Typography className={classes.title}>{getTabLabel()}</Typography>
          </Box>
          <Box className={classes.tabContent}>
            Tab {getTabLabel()}
          </Box>
        </Box>
        <Box id="tabs-content" paddingTop="8px">
          <Tabs
            selectedId={tabId}
            tabsList={tabsList}
            onChangeTab={handleChangeTab}
          />
        </Box>
      </Box>
    </DrawerBar>

  );
}

SettingPanel.propTypes = {
  open: bool,
  tabsList: arrayOf(shape({
    id: oneOfType([string, number]),
    label: oneOfType([string, number]),
    icon: string
  })),
  onClose: func,
  selectedTabId: oneOfType([string, number])
};

export default SettingPanel;

