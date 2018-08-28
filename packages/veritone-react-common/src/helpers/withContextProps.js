import React from 'react';
import { wrapDisplayName, setDisplayName } from 'recompose';

const withContextProps = (ContextConsumer, mapContextToProps) => Component =>
  setDisplayName(wrapDisplayName(Component, 'withContextProps'))(props => (
    <ContextConsumer>
      {context => <Component {...props} {...mapContextToProps(context)} />}
    </ContextConsumer>
  ));

export default withContextProps;
