import React from 'react';
import { func, number, string, bool } from 'prop-types';
import cx from 'classnames'
import Checkbox from '@material-ui/core/CheckBox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import styles from './styles.scss';

const MultiEditActionBar = ({
  selectedItemsCount,
  itemType,
  itemsRecognized,
  onSelectAllChange,
  onAddToExistingEntityClick,
  onAddNewEntityClick,
  onDeleteItemClick,
  disableLibraryButtons
}) => {
  return (
    <div className={styles.multiEditActionBox}>
      <FormControlLabel
        checked={selectedItemsCount > 0}
        control={
          <Checkbox
            value="selectAll"
            color="primary"
            indeterminate={selectedItemsCount > 0}
            classes={{ root: styles.selectAllCheckBox }}
          />
        }
        label={
          selectedItemsCount > 0
            ? `${selectedItemsCount} ${itemsRecognized ? 'Known' : 'Unknown'} ${
                itemType ? itemType : 'Item'
              }${selectedItemsCount > 1 ? 's' : ''} Selected`
            : 'Select All'
        }
        onChange={onSelectAllChange}
        classes={{
          root: styles.selectAllFormControl,
          label: styles.selectAllLabel
        }}
      />
      {selectedItemsCount > 0 && (
        <div
          className={styles.bulkFaceEditActions}
          data-veritone-component="multi-edit-action-bar"
        >
          <IconButton
            classes={{ root: styles.bulkFaceEditActionButton }}
            onClick={onAddToExistingEntityClick}
            disabled={disableLibraryButtons}
            data-veritone-element={`on-add-to-existing-entity${
              disableLibraryButtons ? '-disabled' : ''
            }`}
          >
            <Tooltip title="Add to an Existing Entity" placement="bottom-start">
              <Icon className={cx("icon-existing-entity", styles.entityIcon)}/>
            </Tooltip>
          </IconButton>
          <IconButton
            classes={{ root: styles.bulkFaceEditActionButton }}
            onClick={onAddNewEntityClick}
            disabled={disableLibraryButtons}
            data-veritone-element={`add-to-new-entity${
              disableLibraryButtons ? '-disabled' : ''
            }`}
          >
            <Tooltip title="Create New Entity" placement="bottom-start">
              <Icon className={cx("icon-new-entity", styles.entityIcon)}/>
            </Tooltip>
          </IconButton>
          <IconButton
            classes={{ root: styles.bulkFaceEditActionButton }}
            onClick={onDeleteItemClick}
            data-veritone-element="delete-button"
          >
            <Tooltip
              title={
                itemsRecognized
                  ? `Remove Entit${selectedItemsCount > 1 ? 'ies' : 'y'}`
                  : `Delete${itemType ? ' ' + itemType : ''} Detection${
                      selectedItemsCount > 1 ? 's' : ''
                    }`
              }
              placement="bottom-start"
            >
              <DeleteIcon />
            </Tooltip>
          </IconButton>
        </div>
      )}
    </div>
  );
};

MultiEditActionBar.propTypes = {
  selectedItemsCount: number,
  itemType: string,
  itemsRecognized: bool,
  onSelectAllChange: func,
  onAddToExistingEntityClick: func,
  onAddNewEntityClick: func,
  onDeleteItemClick: func,
  disableLibraryButtons: bool
};

export default MultiEditActionBar;
