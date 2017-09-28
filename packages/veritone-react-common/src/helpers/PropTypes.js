import ReactPropTypes from 'prop-types';

export default {
  ...ReactPropTypes,

  children: ReactPropTypes.node,

  // redux-form
  inputShape: ReactPropTypes.shape({
    name: ReactPropTypes.string,
    onBlur: ReactPropTypes.func,
    onChange: ReactPropTypes.func,
    onDragStart: ReactPropTypes.func,
    onDrop: ReactPropTypes.func,
    onFocus: ReactPropTypes.func,
    value: ReactPropTypes.any
  }),
  metaShape: ReactPropTypes.shape({
    touched: ReactPropTypes.bool,
    error: ReactPropTypes.string,
    warning: ReactPropTypes.string
  })
};
