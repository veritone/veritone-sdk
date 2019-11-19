import React from 'react';
import { node, number, bool, func } from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import DragHandle from '@material-ui/icons/DragHandle';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import cx from 'classnames';
import { form } from '../configuration';
import useSortable from '../hooks/useSortable';
import useStyles from './styles.js';


export default function PreviewWrapper({
  selected,
  children,
  index,
  addBlock,
  swapBlock,
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

  const styles = useStyles({});

  const handleSelect = React.useCallback(() => selectBlock(index), [index, selectBlock]);
  const handleRemove = React.useCallback(() => removeBlock(index), [index, selectBlock]);

  return drop(
    preview(
      <div
        ref={dropRef}
        className={cx(
          styles.previewContainer,
          {
            [styles.previewContainerSelected]: selected
          }
        )}
        style={isDragging || isHovered ? { opacity: 0, height: 60 } : {}}
      >
        <div className={styles.previewContent}>{children}</div>
        <div className={styles.previewAction}>
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
  addBlock: func,
  swapBlock: func,
  selectBlock: func,
  removeBlock: func
}
