import React from 'react';
import { arrayOf, func, objectOf, bool } from 'prop-types';
import cx from 'classnames';

import itemShape from '../itemShape';
import GridviewItem from './GridViewItem';
import styles from './styles.scss';

const FolderGridView = ({
  items,
  highlightedItems,
  onHighlightItem,
  onSelectItem,
}) => {
  return (
    <div className={cx(styles["gridview-container"])}>
      {items.map((item, index) => (
        <div
          className={cx(styles["gridview-item"], { [styles['selected']]: highlightedItems[item.id] })}
          id={item.id}
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
