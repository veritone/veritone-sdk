import React from 'react';
import typeConfiguration, { initData } from '../typeConfiguration';

const SELECT_BLOCK = 'form-builder/select-block';
const ADD_BLOCK = 'form-builder/add-block';
const UPDATE_BLOCK = 'form-builder/update-block';
const REMOVE_BLOCK = 'form-builder/remove-block';
const SWAP_BLOCK = 'form-builder/swap-block';

function selectBlock(blockIndex) {
  return {
    type: SELECT_BLOCK,
    payload: {
      blockIndex
    }
  }
}

function addBlock(position, blockType) {
  return {
    type: ADD_BLOCK,
    payload: {
      position,
      blockType
    }
  }
}

function swapBlock(from, to) {
  return {
    type: SWAP_BLOCK,
    payload: {
      from,
      to
    }
  }
}

function updateBlock(index, data) {
  return {
    type: UPDATE_BLOCK,
    payload: {
      index,
      data
    }
  }
}

function removeBlock(index) {
  return {
    type: REMOVE_BLOCK,
    payload: {
      index
    }
  }
}

function formReducer(state, action) {
  switch (action.type) {
    case ADD_BLOCK: {
      const type = action.payload.blockType;
      const name = `${type}-${(new Date()).getTime()}`;
      return {
        selected: action.payload.position <= state.selected ? state.selected + 1 : state.selected,
        definition: [
          ...state.definition.slice(0, action.payload.position),
          typeConfiguration[type].slice(1).reduce((data, type) => ({
            ...data,
            [type]: initData[type],
          }), { type, name }),
          ...state.definition.slice(action.payload.position)
        ]
      };
    }
    case SWAP_BLOCK: {
      const { from, to } = action.payload;
      return {
        selected: state.selected === from ? to : state.selected === to ? from : state.selected,
        definition: state.definition.map((block, index) => {
          if (index === from) {
            return state.definition[to];
          }
          if (index === to) {
            return state.definition[from];
          }
          return block;
        })
      }
    }
    case UPDATE_BLOCK:
      return {
        ...state,
        definition: state.definition.map((data, index) => {
          if (index !== action.payload.index) {
            return data;
          }
          return action.payload.data;
        })
      };

    case REMOVE_BLOCK:
      return {
        selected: state.selected > action.payload.index ? state.selected - 1 : state.selected,
        definition: state.definition.filter((_, index) => index !== action.payload.index)
      };
    case SELECT_BLOCK:
      return {
        ...state,
        selected: action.payload.blockIndex
      }
    default:
      return state;
  }
}

function createAction(dispatch, actionCreator) {
  return function action(...args) {
    dispatch(actionCreator(...args));
  };
}

export default function useForm(definition) {
  const [state, dispatch] = React.useReducer(formReducer, { definition, selected: 0 });
  return [
    state, // form
    createAction(dispatch, addBlock), // add block
    createAction(dispatch, swapBlock), // swap block
    createAction(dispatch, updateBlock), // update block
    createAction(dispatch, removeBlock), // remove block
    createAction(dispatch, selectBlock) // select block
  ]
}
