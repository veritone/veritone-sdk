import React from 'react';
import cx from 'classnames';
import { noop, initial, get, map } from 'lodash';
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
import Button from 'material-ui/Button';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';

import { intersperse } from 'helpers/fp';
import styles from './styles/sectiontree.scss';

const nodeShape = {
  label: string,
  icon: element,
  iconClassName: string
};
nodeShape.children = objectOf(shape(nodeShape));

export const sectionsShape = shape(nodeShape);

class SectionTree extends React.Component {
  static propTypes = {
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

  handleNavigateForward = path => {
    this.props.onNavigate([...this.getNavigationRelativePath(), path]);
  };

  handleNavigateBack = () => {
    this.props.onNavigate(initial(this.getNavigationRelativePath()));
  };

  handleNavigateSibling = path => {
    this.props.onNavigate([...initial(this.getNavigationRelativePath()), path]);
  };

  getNavigationRelativePath = () => {
    const deepestMatchingPath = this.getDeepestMatchedPath();
    const showingPartialPath = deepestMatchingPath !== this.props.activePath;
    return showingPartialPath ? deepestMatchingPath : this.props.activePath;
  };

  getDeepestMatchedPath = () => {
    // find the deepest section we can match in the tree by dropping pieces
    // from the activePath until we find one that works.
    // this can probably be done more cleanly.
    return this.props.activePath.reduce(
      result => {
        const tryPath = intersperse(result, 'children');
        const maybeSection = get(this.props.sections.children, tryPath);

        return maybeSection ? result : initial(result);
      },
      [...this.props.activePath]
    );
  };

  render() {
    const deepestMatchedPath = this.getDeepestMatchedPath();
    const deepestMatchedPathParent = initial(deepestMatchedPath);

    const currentVisibleSection =
      this.props.activePath.length === 0
        ? this.props.sections // root visible by default
        : get(
            this.props.sections.children, // skip root when navigating
            intersperse(deepestMatchedPath, 'children')
          );

    const currentVisibleSectionParent = get(
      this.props.sections.children,
      intersperse(deepestMatchedPathParent, 'children'),
      this.props.sections
    );

    const parentIsRoot = currentVisibleSectionParent === this.props.sections;
    const selectedItemHasChildren = !!currentVisibleSection.children;
    const rootItemSelected = parentIsRoot && !selectedItemHasChildren;

    return (
      <div className={styles.tabsContainer}>
        {!rootItemSelected &&
          this.props.activePath.length > 0 && (
            <SectionTreeTab
              selectedClasses={this.props.selectedItemClasses}
              classes={this.props.classes}
              selected
              label={currentVisibleSection.label}
              leftIcon={<ArrowBackIcon />}
              onClick={this.handleNavigateBack}
              data-testtarget="back-button"
            />
          )}

        {map(
          // render the parent (w/ current section highlighted + its siblings)
          // when we're at a leaf path
          currentVisibleSection.children
            ? currentVisibleSection.children
            : currentVisibleSectionParent.children,
          ({ label, formComponentId, children, icon, iconClassName }, path) => (
            <SectionTreeTab
              selectedClasses={this.props.selectedItemClasses}
              classes={this.props.classes}
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
                  ? this.handleNavigateForward
                  : this.handleNavigateSibling
              }
            />
          )
        )}
      </div>
    );
  }
}

export default SectionTree;

export const SectionTreeTab = ({
  label,
  id,
  leftIcon,
  rightIcon,
  selected,
  selectedClasses = {},
  classes = {},
  onClick = noop
}) => (
  /* eslint-disable react/jsx-no-bind */
  <Button
    classes={{
      root: cx(styles.sectionTreeTab, { [styles.selected]: selected }),
      label: styles.muiButtonLabelOverride
    }}
    onClick={() => onClick(id)}
  >
    <span
      className={cx(styles.leftIcon, classes.leftIcon, {
        [selectedClasses.leftIcon]: selected
      })}
    >
      {leftIcon}
    </span>
    <span className={styles.label}>{label}</span>
    <span className={styles.rightIcon}>{rightIcon}</span>
  </Button>
);

SectionTreeTab.propTypes = {
  label: string,
  id: string,
  leftIcon: element,
  rightIcon: element,
  selected: bool,
  onClick: func,
  classes: objectOf(any),
  selectedClasses: objectOf(any)
};
