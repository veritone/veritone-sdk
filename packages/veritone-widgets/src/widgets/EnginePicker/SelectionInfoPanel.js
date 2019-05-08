import React from 'react';
import { connect } from 'react-redux';
import { objectOf, any, func, string } from 'prop-types';

import * as multipleEngineSelectionModule from '../../redux/modules/multipleEngineSelection';
import widget from '../../shared/widget';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import StarIcon from '@material-ui/icons/Star';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import { SelectionButton } from 'veritone-react-common';

import styles from './styles.scss';

@connect((state, { ids }) => {
  return {
    selected: multipleEngineSelectionModule.selectedEngines(state)
  };
})
class SelectionInfoPanel extends React.PureComponent {
  static propTypes = {
    selected: objectOf(any),
    toggleEngine: func,
    selectSpecial: func,
    selectSpecialLabel: string,
    selectSpecialId: string
  };

  static defaultProps = {
    selectSpecialLabel: 'Baseline'
  };

  getRemoveHandler = engineId => () => {
    if (engineId === this.props.selectSpecialId) {
      this.props.selectSpecial(undefined);
    }
    this.props.toggleEngine({ rowId: engineId });
  };

  getSelectionHandler = engineId => () => this.props.selectSpecial(engineId);

  render() {
    return (
      <Paper elevation={4} style={{ height: '100%', minHeight: '300px' }}>
        <div className={styles.pickerTitle}>
          <Typography variant="headline">
            Selected Engines{' '}
            <Typography
              variant="subheading"
              style={{ display: 'inline-block' }}
            >
              {Object.keys(this.props.selected).length} / 6
            </Typography>
          </Typography>
        </div>
        <List>
          {Object.entries(this.props.selected).map(([engineId, engine]) => {
            return (
              engine && (
                <ListItem key={engine.id} divider>
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid item xs={1} className={styles.alignRight}>
                      {engine.owned && (
                        <ListItemIcon>
                          <StarIcon />
                        </ListItemIcon>
                      )}
                    </Grid>
                    <Grid item xs={this.props.selectSpecial ? 8 : 9}>
                      <Typography variant="subheading">
                        {engine.name}
                      </Typography>
                      <Typography variant="caption">
                        {engine.ownerOrganization.name}
                      </Typography>
                    </Grid>
                    {this.props.selectSpecial && (
                      <Grid item xs={2} className={styles.alignRight}>
                        <SelectionButton
                          selected={this.props.selectSpecialId === engine.id}
                          toggleSelection={this.getSelectionHandler(engine.id)}
                        >
                          {this.props.selectSpecialLabel}
                        </SelectionButton>
                      </Grid>
                    )}
                    <Grid item xs={1} className={styles.alignRight}>
                      <ListItemIcon>
                        <IconButton
                          aria-label="unselect_engine"
                          onClick={this.getRemoveHandler(engine.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemIcon>
                    </Grid>
                  </Grid>
                </ListItem>
              )
            );
          })}
        </List>
      </Paper>
    );
  }
}

const SelectionInfoPanelWidget = widget(SelectionInfoPanel);
export { SelectionInfoPanel as default, SelectionInfoPanelWidget };
