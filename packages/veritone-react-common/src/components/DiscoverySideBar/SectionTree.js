import React from 'react';
import cx from 'classnames';
import { noop, initial, get } from 'lodash';
import {
  string,
  arrayOf,
  shape,
  func,
  number,
  objectOf,
  element,
  bool,
  any
} from 'prop-types';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { withStyles, makeStyles } from '@material-ui/styles';
import { intersperse } from 'helpers/fp';
import Chip from '../Chip';
import styles from './styles/sectiontree';

const nodeShape = {
  // formComponentId for a leaf, or label/children for a node
  label: string,
  formComponentId: string
};
nodeShape.children = arrayOf(shape(nodeShape));

export const sectionsShape = shape(nodeShape);
const useStyles = makeStyles(styles);

class SectionTree extends React.Component {
  static propTypes = {
    sections: sectionsShape.isRequired,
    formComponents: objectOf(element).isRequired,
    activePath: arrayOf(number).isRequired,
    onNavigate: func.isRequired,
    classes: shape({ any }),
  };

  handleNavigateForward = index => {
    this.props.onNavigate([...this.props.activePath, index]);
  };

  handleNavigateBack = () => {
    this.props.onNavigate(initial(this.props.activePath));
  };

  render() {
    const currentPath = intersperse(this.props.activePath, 'children');
    const { classes } = this.props;
    const currentVisibleSection = get(
      this.props.sections.children, // skip root when navigating
      currentPath,
      this.props.sections // root visible by default
    );

    const visibleFormComponentIdAtLeaf =
      currentVisibleSection.children.length === 1 &&
      currentVisibleSection.children[0].formComponentId;

    return (
      <div className={classes.tabsContainer}>
        {currentPath.length > 0 && (
          <SectionTreeTab
            dark
            label={currentVisibleSection.label}
            leftIcon={<ArrowBackIcon />}
            id={-1}
            onClick={this.handleNavigateBack}
            data-testtarget="back-button"
          />
        )}

        {visibleFormComponentIdAtLeaf
          ? this.props.formComponents[visibleFormComponentIdAtLeaf]
          : currentVisibleSection.children.map(
            ({ visible, label, formComponentId, children }, i) =>
              visible !== false && (
                <SectionTreeTab
                  label={label}
                  rightIcon={<ChevronRightIcon />}
                  key={label}
                  id={i}
                  onClick={this.handleNavigateForward}
                />
              )
          )}
      </div>
    );
  }
}

export default withStyles(styles)(SectionTree);

export const SectionTreeTab = ({
  label,
  id,
  leftIcon,
  rightIcon,
  filterCount,
  dark,
  onClick = noop
}) => {
  const classes = useStyles();
  return (
    /* eslint-disable react/jsx-no-bind */
    <Button
      classes={{
        root: cx(classes.sectionTreeTab, { [classes.dark]: dark }),
        label: classes.muiButtonLabelOverride
      }}
      onClick={() => onClick(id)}
    >
      <span className={classes.leftIcon}>{leftIcon}</span>
      <span className={classes.label}>{label}</span>

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
      <span className={classes.rightIcon}>{rightIcon}</span>
    </Button>
  );
};

SectionTreeTab.propTypes = {
  label: string,
  id: number,
  leftIcon: element,
  rightIcon: element,
  filterCount: number,
  dark: bool,
  onClick: func
};
