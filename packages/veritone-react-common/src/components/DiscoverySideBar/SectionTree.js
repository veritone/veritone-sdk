import React from 'react';
import cx from 'classnames';
import { noop, initial, get, keyBy } from 'lodash';
import {
  string,
  arrayOf,
  shape,
  func,
  number,
  objectOf,
  element,
  bool,
  oneOfType
} from 'prop-types';
import Button from 'material-ui/Button';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';

import { intersperse } from 'helpers/fp';
import Chip from '../Chip';
import styles from './styles/sectiontree.scss';

const nodeShape = {
  label: string,
  icon: oneOfType([element, string]),
  formComponentId: string // formComponentId for a leaf, or label/children for a node
};
nodeShape.children = arrayOf(shape(nodeShape));

export const sectionsShape = shape(nodeShape);

class SectionTree extends React.Component {
  static propTypes = {
    sections: sectionsShape.isRequired,
    formComponents: objectOf(element),
    activePath: arrayOf(number).isRequired,
    onNavigate: func.isRequired,
    iconStyle: objectOf(string),
    selectedFilterStyle: shape({
      icon: objectOf(string)
    })
  };

  handleNavigateForward = (index, path) => {
    this.props.onNavigate(path || [...this.props.activePath, index]);
  };

  handleNavigateBack = (index, path) => {
    this.props.onNavigate(path || initial(this.props.activePath));
  };

  handleNavigateCurrent = (index) => {
    if (this.props.activePath.length > 1) {
      return this.props.onNavigate([...initial(this.props.activePath), index]);
    }

    if (this.props.activePath[0] !== index) {
      return this.props.onNavigate([index]);
    }
  }

  render() {
    const props = {
      leftIconStyle: this.props.iconStyle,
      selectedStyle: this.props.selectedFilterStyle
    }
    const currentPath = intersperse(this.props.activePath, 'children');

    const currentVisibleSection = get(
      this.props.sections.children, // skip root when navigating
      currentPath,
      this.props.sections // root visible by default
    );

    if (!currentVisibleSection.children || !currentVisibleSection.children.length) {
      const activeParentPath = initial(this.props.activePath);
      const currentVisibleSectionParent = get(
        this.props.sections.children, // skip root when navigating
        intersperse(activeParentPath, 'children'),
        this.props.sections // if get returns undefined, we must be at the root
      );

      return (
        <div>
          {currentVisibleSectionParent.label &&
          <SectionTreeTab
            label={currentVisibleSectionParent.label}
            leftIcon={<ArrowBackIcon />}
            id={-1}
            onClick={() => this.handleNavigateBack(null, initial(activeParentPath))}
            data-testtarget="back-button"
            {...props}
          />}
          {currentVisibleSectionParent.children.map(
            ({ visible, label, formComponentId, children, icon }, i) =>
              visible !== false && (
                <SectionTreeTab
                  dark={label === currentVisibleSection.label}
                  label={label}
                  leftIcon={icon}
                  rightIcon={(children && children.length) ? <ChevronRightIcon /> : undefined}
                  key={`${label}-${i}`}
                  id={i}
                  onClick={this.handleNavigateCurrent}
                  {...props}
                />
              )
          )}
        </div>
      )
    }

    const visibleFormComponentIdAtLeaf =
      currentVisibleSection.children.length === 1 &&
      currentVisibleSection.children[0].formComponentId;

      return (
      <div className={styles.tabsContainer}>
        {currentPath.length > 0 && (
          <SectionTreeTab
            dark
            label={currentVisibleSection.label}
            leftIcon={<ArrowBackIcon />}
            id={-1}
            onClick={this.handleNavigateBack}
            data-testtarget="back-button"
            {...props}
          />
        )}

        {visibleFormComponentIdAtLeaf
          ? this.props.formComponents[visibleFormComponentIdAtLeaf]
          : currentVisibleSection.children.map(
              ({ visible, label, formComponentId, children, icon }, i) =>
                visible !== false && (
                  <SectionTreeTab
                    label={label}
                    leftIcon={icon}
                    rightIcon={(children && children.length) ? <ChevronRightIcon /> : undefined}
                    key={`${label}-${i}`}
                    id={i}
                    onClick={this.handleNavigateForward}
                    {...props}
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
  leftIconStyle,
  selectedStyle,
  rightIcon,
  filterCount,
  dark,
  onClick = noop
}) => {
  /* eslint-disable react/jsx-no-bind */
  const leftIconStyles = Object.assign({}, leftIconStyle, dark && selectedStyle && selectedStyle.icon);

 return (
  <Button
      classes={{
        root: cx(styles.sectionTreeTab, { [styles.dark]: dark }),
        label: styles.muiButtonLabelOverride
      }}
      onClick={() => onClick(id)}
    >
      {leftIcon && // render left icon
        React.isValidElement(leftIcon)
        ? <span className={styles.leftIcon}>{React.cloneElement(leftIcon, { style: leftIconStyles })}</span>
        : <span className={cx(styles.leftIcon, leftIcon)} style={leftIconStyles}></span>
      }
      <span className={styles.label}>{label}</span>

      {filterCount > 0 && (
        <div onMouseOver={() => console.log('hover')}>
          <Chip
            label={filterCount}
            hoveredLabel={'clear'}
            style={{ height: 18 }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
      <span className={styles.rightIcon}>{rightIcon}</span>
    </Button>
  )
}

SectionTreeTab.propTypes = {
  label: string,
  id: number,
  leftIcon: oneOfType([element, string]),
  rightIcon: element,
  filterCount: number,
  dark: bool,
  onClick: func,
  leftIconStyle: objectOf(string),
  selectedStyle: shape({
    icon: objectOf(string)
  })
};
