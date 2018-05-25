import React from 'react';
import { isNumber } from 'lodash';
import { node, bool, number, oneOf, shape, string } from 'prop-types';
import { appBarHeight } from '../AppBar';
import { topBarHeight } from '../TopBar';
import { appFooterHeightShort, appFooterHeightTall } from '../AppFooter';

const AppContainer = ({
  topBarOffset,
  appBarOffset,
  appFooterOffset,
  leftOffset,
  children,
  classes
}) => {
  const paddingBottom = {
    short: appFooterHeightShort,
    tall: appFooterHeightTall
  };
  let paddingTop = 'initial';
  if (topBarOffset && appBarOffset) {
    paddingTop = appBarHeight + topBarHeight;
  } else if (topBarOffset) {
    paddingTop = topBarHeight;
  } else if (appBarOffset) {
    paddingTop = appBarHeight;
  }

  const outerStyle = {
    height: '100%',
    paddingTop: paddingTop,
    paddingBottom: paddingBottom[appFooterOffset],
    paddingLeft: isNumber(leftOffset) ? leftOffset : 'initial',
    overflowX: 'hidden'
  };

  // todo: anims when styles change
  return (
    <div style={outerStyle} className={classes.root}>
      <div
        style={{
          height: '100%',
          width: `calc(100% - ${outerStyle.paddingLeft}`,
          overflowX: 'hidden'
        }}
        className={classes.inner}
      >
        {children}
      </div>
    </div>
  );
};

AppContainer.propTypes = {
  children: node,
  leftOffset: number,
  topBarOffset: bool,
  appBarOffset: bool,
  appFooterOffset: oneOf(['short', 'tall']),
  classes: shape({
    root: string,
    inner: string
  })
};

AppContainer.defaultProps = {
  classes: {}
};

export default AppContainer;
