import React from 'react';
import { bool, func, arrayOf, shape } from 'prop-types';
import { get } from 'lodash';
import { Image } from 'veritone-react-common';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Icon from '@material-ui/core/Icon/Icon';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TagEditForm from './TagEditForm';
import styles from './styles.scss';

export default class TagsView extends React.Component {
  static propTypes = {
    tags: arrayOf(shape({})).isRequired,
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
      <Grid
        className={styles.tagsView}
        container
        direction="column"
        data-veritone-component="tags-view"
      >
        <Grid item container justify="space-between" alignItems="center">
          {!editModeEnabled && (
            <Grid item className={styles.tagsTitle}>
              Tags
            </Grid>
          )}
          <Grid item>
            {showEditButton &&
              !editModeEnabled &&
              !!tags.length && (
                <IconButton
                  aria-label="Edit Mode"
                  onClick={onEditButtonClick}
                  classes={{
                    root: styles.editButton
                  }}
                  data-veritone-element="edit-tags-icon-button"
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
              !!get(tags, 'length') &&
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
            {!editModeEnabled &&
              !get(tags, 'length') && (
                <Grid
                  className={styles.noTags}
                  item
                  container
                  spacing={24}
                  direction="column"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item>
                    <Image
                      src="//static.veritone.com/veritone-ui/tags-null.svg"
                      width="80px"
                      height="80px"
                      type="contain"
                    />
                  </Grid>
                  <Grid
                    item
                    container
                    spacing={8}
                    direction="column"
                    justify="center"
                    alignItems="center"
                  >
                    <Grid item className={styles.noTagsText}>
                      No Tags
                    </Grid>
                    <Grid item className={styles.noTagsSubText}>
                      Add tags to group related media together
                    </Grid>
                    <Grid item className={styles.tagsButtonContainer}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={onEditButtonClick}
                        data-veritone-element="add-tags-button"
                      >
                        Add Tags
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              )}
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
