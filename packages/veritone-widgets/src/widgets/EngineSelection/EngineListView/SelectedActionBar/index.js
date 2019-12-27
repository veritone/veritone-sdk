import React from 'react';
import { arrayOf, string, number, func, bool } from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/KeyboardBackspace';
import { makeStyles } from '@material-ui/styles';

import styles from './styles';

const useStyles = makeStyles(styles);

function SelectedActionBar({
  id,
  selectedEngines,
  currentResultsCount,
  allEngines,
  onBack,
  onAddSelected,
  onRemoveSelected,
  onSelectAll,
  disabledSelectAllMessage
}) {
  const classes = useStyles();
  const handleAddSelected = () => {
    onAddSelected(id, selectedEngines);
    onBack(id);
  };
  const handleRemoveSelected = () => {
    onRemoveSelected(id, selectedEngines);
    onBack(id);
  };

  const handleSelectAll = e => {
    e.preventDefault();
    onSelectAll(id, allEngines);
  };

  const displaySelectAllMessage = false; // disabled for now
  // !disabledSelectAllMessage &&
  // selectedEngines.length === currentResultsCount &&
  // selectedEngines.length < allEngines.length;

  return (
    <div className={classes.addRemoveSelectedBar}>
      <div className={classes.back}>
        <IconButton onClick={onBack}>
          <BackIcon />
        </IconButton>
        <div className={classes.selectedCountText}>
          {displaySelectAllMessage && (
            <div>
              All{' '}
              <span className={classes.selectedCount}>{`${
                selectedEngines.length
                }`}</span>{' '}
              engines on this page are selected.{' '}
              <a
                href="#"
                onClick={handleSelectAll} // eslint-disable-line
              >
                Select all{' '}
                <span className={classes.selectedCount}>{`${
                  allEngines.length
                  }`}</span>{' '}
                available engines.
              </a>
            </div>
          )}
          {!displaySelectAllMessage && (
            <div className={classes.selectMessage}>
              {selectedEngines.length} selected
            </div>
          )}
        </div>
      </div>
      <div className={classes.bulkActions}>
        <Button
          color="primary"
          onClick={handleAddSelected} // eslint-disable-line
          disabled={disabledSelectAllMessage}
        >
          Add Selected
        </Button>
        <Button
          color="primary"
          onClick={handleRemoveSelected} // eslint-disable-line
        >
          Remove Selected
        </Button>
      </div>
    </div>
  );
}

SelectedActionBar.propTypes = {
  id: string.isRequired,
  selectedEngines: arrayOf(string).isRequired,
  currentResultsCount: number.isRequired,
  allEngines: arrayOf(string).isRequired,
  onBack: func.isRequired,
  onAddSelected: func.isRequired,
  onRemoveSelected: func.isRequired,
  onSelectAll: func.isRequired,
  disabledSelectAllMessage: bool.isRequired
};

export default SelectedActionBar;
