import React from 'react';
import { func, arrayOf, string, objectOf, any } from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import styles from './styles/container';
import SectionTree, { sectionsShape } from './SectionTree';

export { sectionsShape } from './SectionTree';

const useStyles = makeStyles(styles);

export default function NavigationSideBarContainer({
  sections,
  activePath,
  onNavigate,
  selectedItemClasses,
  classes
}) {
  const muiClasses = useStyles();
  return (
    <div className={muiClasses.container}>
      <div style={{ width: '100%' }}>
        <SectionTree
          sections={sections}
          activePath={activePath}
          onNavigate={onNavigate}
          classes={classes}
          selectedItemClasses={selectedItemClasses}
        />
      </div>
    </div>
  )
}

NavigationSideBarContainer.propTypes = {
  sections: sectionsShape.isRequired,
  classes: objectOf(any),
  selectedItemClasses: objectOf(any),
  activePath: arrayOf(string).isRequired,
  onNavigate: func.isRequired
};
