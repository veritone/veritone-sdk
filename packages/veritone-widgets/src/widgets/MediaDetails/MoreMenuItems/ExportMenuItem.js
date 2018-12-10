import React, { Component } from 'react';
import { shape, arrayOf, string, func, bool } from 'prop-types';
import { includes, without, find } from 'lodash';
import { Manager, Reference, Popper } from 'react-popper';
import styles from './styles.scss';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

class ExportMenuItem extends Component {
  static propTypes = {
    label: string.isRequired,
    onExportClicked: func.isRequired,
    onMoreClicked: func.isRequired,
    categoryExportFormats: arrayOf(
      shape({
        label: string.isRequired
      })
    ).isRequired,
    onCloseMoreMenu: func,
    exportClosedCaptionsEnabled: bool
  };

  static defaultProps = {
    exportClosedCaptionsEnabled: false
  };

  state = {
    selectedFormats: [],
    showSubMenu: false
  };

  toggleSubMenu = () => {
    this.setState(prevState => ({
      showSubMenu: !prevState.showSubMenu
    }));
  };

  handleFormatToggle = name => event => {
    if (includes(this.state.selectedFormats, name)) {
      this.setState(prevState => ({
        selectedFormats: without(prevState.selectedFormats, name)
      }));
      return;
    }

    this.setState(prevState => ({
      selectedFormats: [...prevState.selectedFormats, name]
    }));
  };

  handleQuickExport = event => {
    const { selectedFormats } = this.state;
    if (selectedFormats.length) {
      this.props.onCloseMoreMenu();
      this.props.onExportClicked(selectedFormats);
    }
  };

  render() {
    const {
      label,
      onMoreClicked,
      categoryExportFormats,
      exportClosedCaptionsEnabled
    } = this.props;
    const { showSubMenu, selectedFormats } = this.state;

    const hasSubtitleFormats = !!find(categoryExportFormats, format =>
      includes(format.types, 'subtitle')
    );

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <MenuItem
              ref={ref}
              classes={{ root: styles.moreMenuItem }}
              onClick={this.toggleSubMenu}
            >
              {label}
              <ChevronRightIcon className={styles.rightArrowIcon} />
            </MenuItem>
          )}
        </Reference>
        {showSubMenu && (
          <Popper placement="left-start">
            {({ ref, style, placement }) => (
              <div
                ref={ref}
                style={{
                  ...style,
                  left: -300
                }}
                data-placement={placement}
              >
                <Grow in={showSubMenu} id="sub-menu-list-grow">
                  <Paper className={styles.exportFormatMenu}>
                    <MenuList>
                      <ListItem className={styles.subMenuTitle} disableGutters>
                        TRANSCRIPTION{hasSubtitleFormats &&
                        exportClosedCaptionsEnabled
                          ? ' & SUBTITLES'
                          : ''}
                      </ListItem>
                      {categoryExportFormats.map(format => {
                        if (
                          !exportClosedCaptionsEnabled &&
                          includes(format.types, 'subtitle')
                        ) {
                          return null;
                        }
                        return (
                          <MenuItem
                            key={`format-menu-item-${format.format}`}
                            className={styles.formatMenuItem}
                            onClick={this.handleFormatToggle(format.format)}
                          >
                            <Checkbox
                              color="primary"
                              checked={includes(selectedFormats, format.format)}
                            />
                            {`.${format.format} `}
                            <span className={styles.formatLabel}>
                              ({format.label})
                            </span>
                          </MenuItem>
                        );
                      })}
                      <ListItem className={styles.subMenuActions}>
                        <Button onClick={onMoreClicked}>More</Button>
                        <Button
                          color="primary"
                          variant="raised"
                          disabled={!selectedFormats.length}
                          onClick={this.handleQuickExport}
                        >
                          Export
                        </Button>
                      </ListItem>
                    </MenuList>
                  </Paper>
                </Grow>
              </div>
            )}
          </Popper>
        )}
      </Manager>
    );
  }
}

export default ExportMenuItem;
