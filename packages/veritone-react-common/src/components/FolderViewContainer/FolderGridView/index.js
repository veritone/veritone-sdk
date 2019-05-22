import React from 'react';
import { arrayOf, func, objectOf, bool, shape, string } from 'prop-types';
import cx from 'classnames';

import itemShape from '../itemShape';
import GridviewItem from './GridViewItem';
import styles from './styles.scss';

const FolderListView = ({
  items,
  highlightedItems,
  onHighlightItem,
  onSelectItem,
}) => {
  return (
    <div className={cx(styles["gridview-container"])}>
      {items.map(({
        id,
        type,
        name,
        primaryAsset,
        modifiedDateTime,
        streams
      }, index) => {
        const url = (streams && streams.uri) ? streams.uri : (primaryAsset && primaryAsset.signedUri) ? primaryAsset.signedUri : null;
        return (
          <div
            className={cx(styles["gridview-item"], { [styles['selected']]: highlightedItems[id] })}
            id={id}
            key={id}
            data-id={id}
            data-index={index}
            onClick={onHighlightItem}
            onDoubleClick={onSelectItem}
          >
            <GridviewItem
              type={type}
              url={url}
              name={name}
              modifiedDateTime={modifiedDateTime}
              primaryAsset={primaryAsset}
              isSelected={highlightedItems[id]}
            />
          </div>)
      })
      }
    </div>

  )
}

FolderListView.propTypes = {
  onSelectItem: func,
  items: arrayOf(itemShape),
  onHighlightItem: func,
  highlightedItems: objectOf(bool),
  primaryAsset: shape({
    signedUri: string
  }),
  streams: shape({
    uri: string
  })
}

export default FolderListView;
