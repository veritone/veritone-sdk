import React from 'react';
import { arrayOf, string, shape, func, objectOf, bool } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


import itemShape from '../itemShape';
import GridviewItem from './GridViewItem'

const muiStyles = () => ({
  tableHeadRow: {
    height: 0,
    padding: 0,
  },
  tableRowHeadColumn: {
    height: 0,
    lineHeight: 0,
    visibility: 'hidden',
    whiteSpace: 'nowrap',
    padding: 0
  },
  tableRow: {
    borderBottom: 0,
    color: 'rgba(0,0,0,0.54)',
    cursor: 'pointer',
    userSelect: 'none'
  },
  tableRowFirstColumn: {
    display: 'flex',
    alignItems: 'center'
  },
  selected: {
    background: 'rgba(0,0,0,0.37)'
  },
  videoComponent: {
    display: "flex",
    flexWrap: "wrap",
    margin: "0 auto",
  },
  player: {
    margin: 10,
    maxWidth: 240,
    flex: "1 0 32%"
  },
  headerTitle: {
    padding: 20
  },
  widgetTitle: {
    textTransform: "uppercase",
    margin: "10px 0",
    borderLeft: "4px solid #f39c12",
    paddingLeft: 10,
    fontVariant: "small-caps",
    fontWeight: "bold",
    color: "#2196F3",
    borderBottom: "1px solid #ccc",
    fontFamily: "Roboto",
    fontSize: 18
  }
});

const FolderListView = ({
  classes,
  items,
  highlightedItems,
  onHighlightItem,
  onSelectItem
}) => {
  return (
    <div className={classes.videoComponent}>
      {items.map((item) => (
        <div key={item.id} className={classes.player}>
          <GridviewItem
            type={item.type}
            url={item.fileLocation}
            name={item.name}
            content={item.content}
            modifiedDateTime={item.modifiedDateTime}
            primaryAsset={item.primaryAsset}
          />
        </div>
      )
      )}
    </div>

  )
}

FolderListView.propTypes = {
  classes: shape(Object.keys(muiStyles).reduce(
    (classShape, key) => ({ classShape, [key]: string }), {})
  ),
  onSelectItem: func,
  items: arrayOf(itemShape),
  onHighlightItem: func,
  highlightedItems: objectOf(bool),
}

export default withStyles(muiStyles)(FolderListView);
