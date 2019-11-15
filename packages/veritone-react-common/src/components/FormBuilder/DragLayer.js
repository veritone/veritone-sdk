import React from 'react';
import { useDragLayer } from 'react-dnd';
import { form } from './configuration';
import { BlockPreview } from './FormBlocks';
import useStyles from './DragLayer.style.js';

function getItemStyles(initialOffset, currentOffset) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }
  let { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}
const CustomDragLayer = () => {
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset,
  } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  const styles = useStyles({});

  function renderItem() {
    switch (itemType) {
      case form:
        if (item.isBlock) {
          return <BlockPreview type={item.id} />
        }
        return null;
      default:
        return null
    }
  }
  if (!isDragging) {
    return null
  }

  return (
    <div className={styles.layer}>
      <div
        style={getItemStyles(initialOffset, currentOffset)}
      >
        {renderItem()}
      </div>
    </div>
  )
}
export default CustomDragLayer
