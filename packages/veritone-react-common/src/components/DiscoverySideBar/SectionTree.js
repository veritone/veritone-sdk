import React from 'react';
import cx from 'classnames';
import { get } from 'lodash';
import {
  string,
  arrayOf,
  shape,
  number,
  objectOf,
  element,
  bool
} from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { intersperse } from 'helpers/fp';
import Chip from '../Chip';
import styles from './styles/sectiontree.scss';

const nodeShape = {
  // formComponentId for a leaf, or label/children for a node
  label: string,
  formComponentId: string
};
nodeShape.children = arrayOf(shape(nodeShape));

export const sectionsShape = shape(nodeShape);

class SectionTree extends React.Component {
  static propTypes = {
    sections: sectionsShape.isRequired,
    formComponents: objectOf(element).isRequired,
    activePath: arrayOf(number),
    checkboxCount: number,
  };

  render() {
    const currentPath = intersperse(this.props.activePath, 'children');

    const currentVisibleSection = get(
      this.props.sections.children, // skip root when navigating
      currentPath,
      this.props.sections // root visible by default
    );

    return (
      <div className={styles.tabsContainer}>
        {currentVisibleSection.children.map(
          ({ visible, label, formComponentId, children, icon, type }, i) =>
            (
              <SectionTreeTab
                label={label}
                icon={icon}
                key={label}
                checkboxCount={this.props.checkboxCount}
                type={type}
                formComponentIdAtLeaf={currentVisibleSection.children[i].children[0].formComponentId}
                formComponents={this.props.formComponents}
                id={i}
                onChange={this.handleChangeExpand}
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
  icon,
  filterCount,
  dark,
  type,
  checkboxCount,
  formComponentIdAtLeaf,
  formComponents
}) => {
  /* eslint-disable react/jsx-no-bind */
  return (
    <ExpansionPanel
      classes={{
        root: styles.noShadow,
        expanded: styles.expandedStyle,
      }}
    >
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
        classes={{
          root: cx(styles.sectionTab, { [styles.dark]: dark }, styles.noShadow),
          expanded: styles.expandedStyle,
        }}
      >
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label}>{label}</span>

        {type === 'checkbox' && checkboxCount[formComponentIdAtLeaf] !== 0 ? (
          <span className={styles.count}> &nbsp; ({checkboxCount[formComponentIdAtLeaf]})</span>
        ) : ''}

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
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{color: 'black'}}>
        {formComponents[formComponentIdAtLeaf]}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
};

SectionTreeTab.propTypes = {
  label: string,
  icon: element,
  filterCount: number,
  dark: bool,
  formComponentIdAtLeaf: string,
  formComponents: objectOf(element),
  checkboxCount: number,
  type: string
};
