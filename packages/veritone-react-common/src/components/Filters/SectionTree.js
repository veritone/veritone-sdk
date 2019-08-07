import React from 'react';
import cx from 'classnames';
import {
  string,
  arrayOf,
  shape,
  number,
  objectOf,
  element,
  bool,
  func,
  oneOfType
} from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styles from './styles/sectiontree.scss';
import DefaultCheckboxes from './DefaultCheckboxes';

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
    checkboxCount: objectOf(number),
    onCheckboxChange: func
  };


  render() {
    const currentVisibleSection = this.props.sections;
    console.log(this.props);

    return (
      <div className={styles.tabsContainer}>
        {currentVisibleSection.children.map(({ label, icon, type }, i) => {
          const sectionChildren = currentVisibleSection.children[i];
          // const formComponentIdAtLeaf = .children[0].formComponentId;
          return (
            <SectionTreeTab
              label={label}
              icon={icon}
              key={label}
              checkboxCount={this.props.checkboxCount}
              type={type}
              formComponentIdAtLeaf={
                sectionChildren.children[0]
                  ? sectionChildren.children[0].formComponentId
                  : 'default-checkboxes'
              }
              checkboxValues={sectionChildren.valueArray}
              formComponents={this.props.formComponents}
              id={i}
              onCheckboxChange={this.props.onCheckboxChange}
            />
          );
        })}
      </div>
    );
  }
}

export default SectionTree;

export const SectionTreeTab = ({
  label,
  icon,
  dark,
  type,
  checkboxCount,
  checkboxValues,
  formComponentIdAtLeaf,
  formComponents,
  onCheckboxChange
}) => {
  const isNotZeroOrUndefined = value => {
    return ![0, undefined].includes(value)
  }
  /* eslint-disable react/jsx-no-bind */
  return (
    <ExpansionPanel
      classes={{
        root: styles.noShadow,
        expanded: styles.expandedStyle
      }}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        classes={{
          root: cx(styles.sectionTab, { [styles.dark]: dark }, styles.noShadow),
          expanded: styles.expandedStyle
        }}
      >
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label} data="test-label">
          {label}
        </span>

        {type === 'display-count' &&
          isNotZeroOrUndefined(checkboxCount[formComponentIdAtLeaf]) ? (
            <span className={styles.count} data="test-count">
              &nbsp; ({checkboxCount[formComponentIdAtLeaf]})
          </span>
          ) : (
            ''
          )}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ color: 'black' }}>
        {formComponentIdAtLeaf.includes('default-checkboxes') ? (
          <DefaultCheckboxes
            checkboxValues={checkboxValues}
            onCheckboxChange={onCheckboxChange}
            formComponentIdAtLeaf={formComponentIdAtLeaf}
          />
        ) : (
            formComponents[formComponentIdAtLeaf]
          )}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

SectionTreeTab.propTypes = {
  label: string,
  icon: element,
  dark: bool,
  formComponentIdAtLeaf: string,
  formComponents: objectOf(element),
  checkboxCount: objectOf(number),
  type: string,
  onCheckboxChange: func,
  checkboxValues: arrayOf(oneOfType([string, number]))
};
