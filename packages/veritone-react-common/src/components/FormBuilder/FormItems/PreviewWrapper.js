import React from 'react';
import { node, number, bool, func } from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import DragHandle from '@material-ui/icons/DragHandle';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import cx from 'classnames';
import { form } from '../configuration';
import useSortable from '../hooks/useSortable';
import styles from './styles.scss';


export default function PreviewWrapper({
  selected,
  children,
  index,
  swapBlock,
  addBlock,
  selectBlock,
  removeBlock
}) {
  const dropRef = React.createRef();

  const [{ isDragging, isHovered }, drag, preview, drop] = useSortable(
    index,
    form,
    dropRef,
    addBlock,
    swapBlock
  );

  const handleSelect = React.useCallback(() => selectBlock(index), [index]);
  const handleRemove = React.useCallback(() => removeBlock(index), [index]);

  return drop(
    preview(
      <div
        ref={dropRef}
        className={cx(
          styles['preview-container'],
          {
            [styles['preview-container--selected']]: selected
          }
        )}
        style={isDragging || isHovered ? { opacity: 0, height: 60 } : {}}
      >
        <div className={styles['preview-content']}>{children}</div>
        <div className={styles['preview-action']}>
          <div ref={drag}>
            <IconButton>
              <DragHandle />
            </IconButton>
          </div>
          <IconButton onClick={handleSelect}>
            <Edit />
          </IconButton>
          <IconButton onClick={handleRemove}>
            <Delete />
          </IconButton>
        </div>
      </div>
    )
  );
}

PreviewWrapper.propTypes = {
  selected: bool,
  children: node,
  index: number,
  swapBlock: func,
  addBlock: func,
  selectBlock: func,
  removeBlock: func
}
