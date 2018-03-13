import React from 'react';
import { arrayOf, string, number, func, bool } from 'prop-types';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui-icons/KeyboardBackspace';
import { blue } from 'material-ui/colors';

import styles from './styles.scss';

function SelectedActionBar({
  selectedEngines,
  currentResultsCount,
  allEngines,
  onBack,
  onAddSelected,
  onRemoveSelected,
  onSelectAll,
  disabledSelectAllMessage
}) {
  const handleOnAddSelected = () => {
    onAddSelected(selectedEngines);
    onBack();
  };
  const handleOnRemoveSelected = () => {
    onRemoveSelected(selectedEngines);
    onBack();
  };

  const handleSelectAll = e => {
    e.preventDefault();
    onSelectAll(allEngines);
  };

  const displaySelectAllMessage =
    !disabledSelectAllMessage &&
    selectedEngines.length === currentResultsCount &&
    selectedEngines.length < allEngines.length;

  return (
    <div className={styles.addRemoveSelectedBar}>
      <div className={styles.back}>
        <IconButton onClick={onBack}>
          <BackIcon />
        </IconButton>
        <div className={styles.selectedCountText}>
          {displaySelectAllMessage && (
            <div>
              All{' '}
              <span className={styles.selectedCount}>{`${
                selectedEngines.length
              }`}</span>{' '}
              engines on this page are selected.{' '}
              <a href="#" onClick={handleSelectAll}>
                Select all{' '}
                <span className={styles.selectedCount}>{`${
                  allEngines.length
                }`}</span>{' '}
                available engines.
              </a>
            </div>
          )}
          {!displaySelectAllMessage && (
            <div className={styles.selectMessage}>
              {selectedEngines.length} selected
            </div>
          )}
        </div>
      </div>
      <div className={styles.bulkActions}>
        <Button
          color="primary"
          onClick={handleOnAddSelected}
          disabled={disabledSelectAllMessage}
        >
          Add Selected
        </Button>
        <Button color="primary" onClick={handleOnRemoveSelected}>
          Remove Selected
        </Button>
      </div>
    </div>
  );
}

SelectedActionBar.propTypes = {
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
