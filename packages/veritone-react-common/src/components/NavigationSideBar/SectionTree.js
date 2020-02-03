import React from 'react';
import cx from 'classnames';
import { noop, initial, get, map, kebabCase } from 'lodash';
import {
  string,
  arrayOf,
  shape,
  func,
  element,
  bool,
  objectOf,
  any
} from 'prop-types';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles } from '@material-ui/styles';
import { intersperse } from 'helpers/fp';
import styles from './styles/sectiontree';

const nodeShape = {
  label: string,
  icon: element,
  iconClassName: string
};
nodeShape.children = objectOf(shape(nodeShape));

export const sectionsShape = shape(nodeShape);
const useStyles = makeStyles(styles);

export default function SectionTree({
  sections,
  activePath,
  onNavigate,
  selectedItemClasses,
  classes
}) {
  const muiClasses = useStyles();
  const getDeepestMatchedPath = () => {
    // find the deepest section we can match in the tree by dropping pieces
    // from the activePath until we find one that works.
    // this can probably be done more cleanly.
    return activePath.reduce(
      result => {
        const tryPath = intersperse(result, 'children');
        const maybeSection = get(sections.children, tryPath);
        return maybeSection ? result : initial(result);
      },
      [...activePath]
    );
  };

  const getNavigationRelativePath = () => {
    const deepestMatchingPath = getDeepestMatchedPath();
    const showingPartialPath = deepestMatchingPath !== activePath;
    return showingPartialPath ? deepestMatchingPath : activePath;
  };

  const handleNavigateForward = (path) => {
    onNavigate([...getNavigationRelativePath(), path]);
  };

  const handleNavigateBack = () => {
    onNavigate(initial(getNavigationRelativePath()));
  };

  const handleNavigateSibling = (path) => {
    onNavigate([...initial(getNavigationRelativePath()), path]);
  };

  const deepestMatchedPath = getDeepestMatchedPath();
  const deepestMatchedPathParent = initial(deepestMatchedPath);

  const currentVisibleSection =
    activePath.length === 0
      ? sections // root visible by default
      : get(
        sections.children, // skip root when navigating
        intersperse(deepestMatchedPath, 'children')
      );

  const currentVisibleSectionParent = get(
    sections.children,
    intersperse(deepestMatchedPathParent, 'children'),
    sections
  );

  const parentIsRoot = currentVisibleSectionParent === sections;
  const selectedItemHasChildren = !!currentVisibleSection.children;
  const rootItemSelected = parentIsRoot && !selectedItemHasChildren;

  return (
    <div className={muiClasses.tabsContainer}>
      {!rootItemSelected &&
        activePath.length > 0 && (
          <SectionTreeTab
            selectedClasses={selectedItemClasses}
            classes={classes}
            selected
            label={currentVisibleSection.label}
            leftIcon={<ArrowBackIcon />}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={handleNavigateBack}
            data-testtarget="back-button"
            btnActionTrackName={currentVisibleSection.btnActionTrackName}
          />
        )}

      {map(
        // render the parent (w/ current section highlighted + its siblings)
        // when we're at a leaf path
        currentVisibleSection.children
          ? currentVisibleSection.children
          : currentVisibleSectionParent.children,
        ({ label, formComponentId, children, icon, iconClassName, btnActionTrackName }, path) => (
          <SectionTreeTab
            selectedClasses={selectedItemClasses}
            classes={classes}
            selected={label === currentVisibleSection.label}
            label={label}
            leftIcon={
              iconClassName ? <span className={iconClassName} /> : icon
            }
            rightIcon={
              children && Object.keys(children).length && <ChevronRightIcon />
            }
            key={`${label}-${path}`}
            id={path}
            onClick={
              currentVisibleSection.children
                ? handleNavigateForward
                : handleNavigateSibling
            }
            btnActionTrackName={btnActionTrackName}
          />
        )
      )}
    </div>
  );
};

SectionTree.propTypes = {
  sections: sectionsShape.isRequired,
  activePath: arrayOf(string).isRequired,
  onNavigate: func.isRequired,
  selectedItemClasses: shape({
    leftIcon: string
  }),
  classes: shape({
    leftIcon: string
  })
};

export const SectionTreeTab = ({
  label = '',
  id,
  leftIcon,
  rightIcon,
  selected,
  selectedClasses = {},
  classes = {},
  onClick = noop,
  btnActionTrackName
}) => {
  const muiClasses = useStyles(); 
  return (
    /* eslint-disable react/jsx-no-bind */
    <Button
      classes={{
        root: cx(muiClasses.sectionTreeTab, { [muiClasses.selected]: selected }),
        label: muiClasses.muiButtonLabelOverride
      }}
      onClick={() => onClick(id)}
      data-veritone-element={btnActionTrackName || `sidebar-${kebabCase(label.toLowerCase())}-button`}
    >
      <span
        className={cx(muiClasses.leftIcon, classes.leftIcon, {
          [selectedClasses.leftIcon]: selected
        })}
      >
        {leftIcon}
      </span>
      <span className={muiClasses.label}>{label}</span>
      <span className={muiClasses.rightIcon}>{rightIcon}</span>
    </Button>
  )};

SectionTreeTab.propTypes = {
  label: string,
  id: string,
  leftIcon: element,
  rightIcon: element,
  selected: bool,
  onClick: func,
  classes: objectOf(any),
  selectedClasses: objectOf(any),
  btnActionTrackName: string
};
