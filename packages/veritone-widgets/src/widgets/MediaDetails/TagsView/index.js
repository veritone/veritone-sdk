import React from 'react';
import { bool, func, arrayOf, shape } from 'prop-types';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Icon from '@material-ui/core/Icon/Icon';
import Typography from '@material-ui/core/Typography';
import TagEditForm from './TagEditForm';
import styles from './styles.scss';

export default class TagsView extends React.Component {
  static propTypes = {
    tags: arrayOf(shape({})),
    showEditButton: bool,
    editModeEnabled: bool,
    onEditButtonClick: func,
    onSubmit: func
  };

  render() {
    const {
      showEditButton,
      editModeEnabled,
      onEditButtonClick,
      tags,
      onSubmit
    } = this.props;
    return (
      <Grid className={styles.tagsView} container direction="column">
        <Grid item container justify="space-between" alignItems="center">
          {!editModeEnabled && (
            <Grid item className={styles.tagsTitle}>
              Tags
            </Grid>
          )}
          <Grid item>
            {showEditButton &&
              !editModeEnabled && (
                <IconButton
                  aria-label="Edit Mode"
                  onClick={onEditButtonClick}
                  classes={{
                    root: styles.editButton
                  }}
                >
                  <Icon className="icon-mode_edit2" />
                </IconButton>
              )}
          </Grid>
        </Grid>
        <Grid
          item
          xs
          container
          direction="column"
          className={styles.tagsContent}
        >
          <Grid
            className={styles.tagsContainer}
            item
            xs
            container
            justify="flex-start"
            alignContent="flex-start"
            alignItems="flex-start"
          >
            {!editModeEnabled &&
              tags
                .filter(item => !item.hasOwnProperty('redactionStatus'))
                .map(tag => {
                  return tag.hasOwnProperty('value') ? (
                    <Grid
                      key={tag.value}
                      item
                      className={styles.viewModePill}
                      zeroMinWidth
                    >
                      <Typography noWrap>{tag.value}</Typography>
                    </Grid>
                  ) : Object.keys(tag).length ? (
                    <Grid
                      key={`${Object.keys(tag)[0]}:${tag[Object.keys(tag)[0]]}`}
                      item
                      className={styles.viewModePill}
                      zeroMinWidth
                    >
                      <Typography noWrap>{`${Object.keys(tag)[0]}:${
                        tag[Object.keys(tag)[0]]
                      }`}</Typography>
                    </Grid>
                  ) : null;
                })}
            {editModeEnabled && (
              <TagEditForm
                form="tagEditFormMDP"
                initialValues={{ tags }}
                onSubmit={onSubmit}
                onCancel={onEditButtonClick}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
