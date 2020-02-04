import React from 'react';

export default function injectInto(children, props) {
  return React.Children.map(children, child =>
    React.cloneElement(child, props)
  );
}
