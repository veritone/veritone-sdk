
export const add = (index, block, item) => {
  return [
    ...block.slice(0, index),
    item,
    ...block.slice(index)
  ];
}

export const remove = (index, block) => {
  return block.filter((_, blockIndex) => blockIndex !== index);
}

export const swap = ({ from, to }, block) => {
  return block.map((blockItem, blockIndex) => {
    if (blockIndex === from) {
      return block[to];
    }
    if (blockIndex === to) {
      return block[from]
    }
    return blockItem;
  })
}

export const update = (index, block, item) => {
  return block.map((blockItem, blockIndex) => {
    if (blockIndex === index) {
      return {
        ...block[index],
        ...item
      };
    }
    return blockItem;
  });
}

export const select = (index, block) => {
  return block.map((blockItem, blockIndex) => {
    if(index !== blockIndex) {
      return {
        ...blockItem,
        selected: false
      };
    }
    return {
      ...blockItem,
      selected: !blockItem.selected
    }
  })
}
