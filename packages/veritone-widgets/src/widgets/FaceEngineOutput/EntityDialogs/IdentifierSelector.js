import React, { Component } from 'react';
import { arrayOf, number, shape, string, bool, func } from 'prop-types';
import { get, find, uniqBy, findIndex } from 'lodash';
import cx from 'classnames';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import styles from './styles.scss';

export default class IdentifierSelector extends Component {
  static propTypes = {
    identifiers: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        object: shape({
          label: string,
          uri: string.isRequired,
          entityId: string,
          libraryId: string
        })
      })
    ).isRequired,
    onConfirm: func.isRequired,
    onCancel: func.isRequired,
    classes: shape({
      imageContainer: string
    }),
    defaultSelectAll: bool,
    creatingIdentifiers: bool
  };

  state = {
    selectedIdentifiers: this.props.defaultSelectAll
      ? this.props.identifiers
      : [],
    lastSelectedIdentifier: null
  };

  handleSelectAll = evt => {
    if (evt.target.checked) {
      this.setState({
        selectedIdentifiers: this.props.identifiers.map(identifier => {
          return {
            ...identifier,
            object: {
              ...identifier.object
            }
          };
        })
      });
    } else {
      this.setState({
        selectedIdentifiers: []
      });
    }
  };

  handleSingleIdentifierSelect = identifier => evt => {
    const { nativeEvent } = evt;
    const { identifiers } = this.props;
    if (evt.target.checked) {
      this.setState(prevState => {
        let newIdentifiers = [identifier];
        if (nativeEvent.shiftKey && prevState.lastSelectedIdentifier) {
          const selectedIndex = findIndex(identifiers, {
            guid: identifier.guid
          });
          const lastIndex = findIndex(identifiers, {
            guid: prevState.lastSelectedIdentifier.guid
          });
          newIdentifiers = identifiers.slice(
            Math.min(selectedIndex, lastIndex),
            Math.max(selectedIndex, lastIndex) + 1
          );
        }
        return {
          selectedIdentifiers: uniqBy(
            [...prevState.selectedIdentifiers, ...newIdentifiers],
            'guid'
          ),
          lastSelectedIdentifier: {
            ...identifier,
            object: {
              ...identifier.object
            }
          }
        };
      });
    } else {
      this.setState(prevState => ({
        selectedIdentifiers: prevState.selectedIdentifiers.filter(i => {
          return identifier.guid !== i.guid;
        })
      }));
    }
  };

  handleFinishClick = () => {
    this.props.onConfirm(this.state.selectedIdentifiers);
  };

  render() {
    const { identifiers, classes, onCancel, creatingIdentifiers } = this.props;
    const { selectedIdentifiers } = this.state;
    return (
      <Grid container direction="column" spacing={0}>
        <Grid
          item
          container
          direction="column"
          wrap="nowrap"
          className={cx(styles.identifierSelector, classes.imageContainer)}
        >
          <Grid item classes={{ item: styles.identifierSelectTitle }}>
            Which images should we use?
          </Grid>
          <Grid item classes={{ item: styles.identifierSelectInfo }}>
            Select the best images of this person to be used to recognize them
            next time.
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  indeterminate={!!selectedIdentifiers.length}
                  checked={!!selectedIdentifiers.length}
                />
              }
              label={
                selectedIdentifiers.length > 0
                  ? `${selectedIdentifiers.length} Face${
                      selectedIdentifiers.length > 1 ? 's' : ''
                    } Selected`
                  : 'Select Faces'
              }
              onChange={this.handleSelectAll}
              classes={{ label: styles.selectAllCheckboxLabel }}
            />
          </Grid>
          <Grid
            item
            container
            spacing={16}
            classes={{ container: styles.identifierImages }}
          >
            {identifiers.map(identifier => {
              return (
                <Grid
                  item
                  key={`identifier-image-${identifier.guid}`}
                  classes={{ item: styles.imageGridItem }}
                >
                  <img
                    src={get(identifier, 'object.uri')}
                    className={styles.identifierImage}
                  />
                  <span className={styles.selectFaceCheckboxBackground} />
                  <Checkbox
                    checked={
                      !!find(selectedIdentifiers, { guid: identifier.guid })
                    }
                    color="primary"
                    disableRipple
                    classes={{ root: styles.selectFaceCheckbox }}
                    onChange={this.handleSingleIdentifierSelect(identifier)}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid
          item
          container
          justify="flex-end"
          classes={{ container: styles.identifierSelectActions }}
        >
          <Button
            color="primary"
            data-veritone-element="back-button"
            classes={{ root: styles.entityDialogButton }}
            onClick={onCancel}
          >
            Back
          </Button>
          <Button
            color="primary"
            data-veritone-element="finish-button"
            classes={{ root: styles.entityDialogButton }}
            onClick={this.handleFinishClick}
            disabled={creatingIdentifiers}
          >
            Finish
          </Button>
        </Grid>
      </Grid>
    );
  }
}
