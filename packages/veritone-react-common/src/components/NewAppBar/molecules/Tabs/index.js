import React from 'react';
import { string, func, oneOfType, number, arrayOf, shape } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Box } from '@material-ui/core';
import TabIcon from '../../atoms/TabIcon';
import styles from './styles';
const useStyles = makeStyles(styles);

function Tabs({
  selectedId,
  onChangeTab,
  tabsList = []
}) {
  const classes = useStyles();
  const [currentSelected, setSelected] = React.useState(selectedId);
  React.useEffect(() => {
    if (selectedId !== currentSelected) {
      setSelected(selectedId);
    }
  }, [selectedId])
  function handleSelectTabItem(id) {
    setSelected(id);
    onChangeTab(id);
  }
  return (
    <Box
      className={classes.tabsContainer}
    >
      {tabsList.map((item, index) => {
        const { id = index, icon } = item;
        return (
          <Box key={id} paddingBottom="8px">
            <TabIcon
              selected={id === currentSelected}
              icon={icon}
              onClickTabIcon={handleSelectTabItem}
              id={id}
            />
          </Box>
        )
      })}
    </Box >
  )
}

Tabs.propTypes = {
  selectedId: oneOfType([string, number]),
  onChangeTab: func,
  tabsList: arrayOf(shape({
    id: oneOfType([string, number]),
    label: oneOfType([string, number]),
    icon: string
  }))
}

export default Tabs

