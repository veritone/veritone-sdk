import { useDrag, useDrop } from 'react-dnd';

export default function useSortable(index, type, dropRef, addBlock, swapBlock) {
  const [{ isDragging }, drag, preview] = useDrag({
    item: {
      index,
      type,
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    })
  });

  const [{ isHovered }, drop] = useDrop({
    accept: type,
    hover: (item, monitor) => {
      if (!dropRef.current) {
        return;
      }

      if (isNaN(item.index)) {
        addBlock(index, item.id);
        item.index = index;
        return;
      }

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      swapBlock(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => {
      return {
        isHovered: monitor.getItem() && (index === monitor.getItem().index && monitor.getItem().isBlock)
      }
    },
    drop: (_, monitor) => {
      return { index: monitor.getItem().index };
    }
  });

  return [
    {
      isHovered,
      isDragging,
    },
    drag,
    preview,
    drop,
  ];
}
