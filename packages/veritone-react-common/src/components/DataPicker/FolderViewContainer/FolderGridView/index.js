import React from 'react';
import { arrayOf, func, objectOf, bool } from 'prop-types';
import cx from 'classnames';
import { makeStyles  } from '@material-ui/styles';

import itemShape from '../itemShape';
import GridviewItem from './GridViewItem';
import styles from './styles';

const useStyles = makeStyles(styles);

const FolderGridView = ({
  items,
  highlightedItems,
  onHighlightItem,
  onSelectItem,
}) => {
  const classes = useStyles();
  return (
    <div className={cx(classes["gridviewContainer"])}>
      {items.map((item, index) => (
        <div
          className={cx(classes["gridviewItem"], { [classes['selected']]: highlightedItems[item.id] })}
          id={item.id}
          type={item.type}
          key={item.id}
          data-id={item.id}
          data-index={index}
          onClick={onHighlightItem}
          onDoubleClick={onSelectItem}
        >
          <GridviewItem
            item={item}
            isSelected={highlightedItems[item.id]}
          />
        </div>
      )
      )}
    </div>

  )
}

FolderGridView.propTypes = {
  onSelectItem: func,
  items: arrayOf(itemShape),
  onHighlightItem: func,
  highlightedItems: objectOf(bool)
}

export default FolderGridView;
