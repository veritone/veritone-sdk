import React from 'react';

export function injectInto(children, props) {
  return React.Children.map(children, child => {
    return React.cloneElement(child, props);
  });
}
