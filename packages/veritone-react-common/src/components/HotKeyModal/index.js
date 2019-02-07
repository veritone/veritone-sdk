import React from 'react';
import { func, bool, arrayOf, shape, string, oneOf } from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import styles from './styles.scss';

export default class HotKeyModal extends React.Component {
  static propTypes = {
    onClose: func.isRequired,
    open: bool,
    title: string,
    hotKeyCategories: arrayOf(shape({
      label: string,
      commands: arrayOf(shape({
        label: string.isRequired,
        hotkeys: arrayOf(shape({
          platform: string, // 'Mac' or 'Win' or 'Lin' or 'Win|Lin'
          operator: oneOf(['or', 'and', '+']),
          keys: arrayOf(string).isRequired
        })).isRequired
      })).isRequired
    })).isRequired
  };

  render() {
    const platform = navigator.platform;
    const platformPrefix = platform.slice(0, 3);
    const {
      onClose,
      title,
      open,
      hotKeyCategories
    } = this.props;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md">
        <DialogTitle>
          {title || "Keyboard Shortcuts"}
        </DialogTitle>
        <DialogContent>
          <Grid
            className={styles.shortcutsContent}
            alignContent="flex-start"
            spacing={24}
            container>
            {
              hotKeyCategories.map((hotKeyCategory, catIndex) => {
                const categoryTitleItem = (
                  <Grid
                    key={`hotkey-category-title-${hotKeyCategory.label}`}
                    className={styles.shortcutsTitle}
                    item
                    xs={12}>
                    {hotKeyCategory.label || ''}
                  </Grid>
                );
                const categoryItems = [categoryTitleItem].concat(
                  hotKeyCategory.commands.map(command => {
                    const hotkeyList = command.hotkeys
                      .filter(hotkey => {
                        if (!hotkey.platform) {
                          return true;
                        }
                        const platforms = hotkey.platform.split('|');
                        const isCompatible = platforms.find(p => p.toLowerCase() === platformPrefix.toLowerCase());
                        return isCompatible;
                      })
                      .map(hotkey => {
                        const totalKeys = hotkey.keys.length;
                        const comboList = [];
                        hotkey.keys.forEach((keyString, index) => {
                          comboList.push(
                            <div
                              key={`hotkey-category-${hotKeyCategory.label}-hotkey-${keyString}`}
                              className={styles.buttonShortcuts}>
                              {keyString}
                            </div>
                          );
                          index < (totalKeys - 1) && comboList.push(
                            <span
                              key={`hotkey-${hotKeyCategory.label}-operand-${keyString}`}
                              className={styles.operator}>
                              {hotkey.operator}
                            </span>
                          );
                        });
                        return (
                          <Grid
                            key={`hotkey-combo-list-${hotkey.keys.join('+')}`}
                            item
                            xs={6}
                            className={styles.shortKey}>
                            { comboList }
                          </Grid>
                        );
                      });

                    return (
                      <Grid
                        key={`hotkey-${hotKeyCategory.label}-command-${command.label}`}
                        spacing={24}
                        item
                        xs={12}
                        container
                        alignItems="center">
                        <Grid
                          item
                          xs={3}
                          className={styles.shortKeyTitle}>
                          {command.label}
                        </Grid>
                        <Grid
                          item
                          container
                          xs={9}>
                          { hotkeyList }
                        </Grid>
                      </Grid>
                    );
                  })
                );
                return (
                  <Grid
                    key={`hotkey-category-${hotKeyCategory.label}-${catIndex}`}
                    xs={6}
                    item>
                    {categoryItems}
                  </Grid>
                );
              })
            }
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            color="primary"
            autoFocus
            className={styles.closeButton}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}