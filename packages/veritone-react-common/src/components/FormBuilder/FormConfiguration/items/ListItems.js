import React from 'react';
import { shape, string, number, func, arrayOf } from 'prop-types';
import { noop } from 'lodash';
import TextField from '@material-ui/core/TextField';
import {
  AddCircleOutline,
  DeleteOutlined,
  DragHandleOutlined
} from '@material-ui/icons';
import useSortable from '../../hooks/useSortable';
import * as blockUtils from '../../blockUtils';

import useStyles from '../styles.js';

const type = "items"

export default function ListItems({ value, onChange, className }) {
  const swapBlock = React.useCallback((from, to) => {
    onChange({
      name: type,
      value: blockUtils.swap({ from, to }, value)
    });
  }, [value, onChange])

  const addBlock = React.useCallback((index) => {
    onChange({
      name: type,
      value: blockUtils.add(index + 1, value, {
        value: `option-${(new Date()).getTime()}`,
        id: (new Date()).getTime().toString()
      })
    })
  }, [value, onChange]);

  const removeBlock = React.useCallback((index) => {
    if (value.length > 1) {
      onChange({
        name: type,
        value: blockUtils.remove(index, value)
      })
    }
  }, [value, onChange]);

  const updateBlock = React.useCallback((index, newValue) => {
    onChange({
      name: type,
      value: blockUtils.update(index, value, { value: newValue })
    });
  }, [value, onChange])

  return (
    <div className={className}>
      <label>Field Items</label>
      <div>
        {
          value.map((block, index) => (
            <Item
              key={block.id}
              block={block}
              index={index}
              swapBlock={swapBlock}
              addBlock={addBlock}
              removeBlock={removeBlock}
              updateBlock={updateBlock}
            />
          ))
        }
      </div>
    </div>
  )
}

ListItems.propTypes = {
  value: arrayOf(shape({
    id: string,
  })),
  onChange: func,
  className: string
}

ListItems.defaultProps = {
  onChange: noop,
  value: []
}

const Item = function Item({
  block,
  index,
  swapBlock,
  addBlock,
  removeBlock,
  updateBlock
}) {
  const dropRef = React.createRef();
  const styles = useStyles({});

  const [
    { isDragging },
    drag,
    preview,
    drop,
  ] = useSortable(index, type, dropRef, addBlock, swapBlock);

  const handleChange = React.useCallback(
    (e) => updateBlock(index, e.target.value),
    [index, updateBlock]
  )

  const handleAdd = React.useCallback(() => addBlock(index), [index, addBlock]);
  const handleRemove = React.useCallback(() => removeBlock(index), [index, removeBlock]);

  return drop(preview(
    <div
      ref={dropRef}
      className={styles.itemContainer}
      style={(isDragging) ? { opacity: 0 } : {}}
    >
      <TextField
        label={`Option-${index + 1}`}
        variant="outlined"
        value={block.value}
        onChange={handleChange}
        fullWidth
      />
      <div ref={drag}>
        <DragHandleOutlined className={styles.previewIcon} />
      </div>
      <AddCircleOutline
        onClick={handleAdd}
        className={styles.previewIcon}
      />
      <DeleteOutlined
        onClick={handleRemove}
        className={styles.previewIcon}
      />
    </div>
  ))
}

Item.propTypes = {
  block: shape({
    value: string,
  }),
  index: number,
  swapBlock: func,
  addBlock: func,
  removeBlock: func
}
