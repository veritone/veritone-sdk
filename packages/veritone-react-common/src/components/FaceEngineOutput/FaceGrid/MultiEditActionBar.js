import React from 'react';
import { func, number, string, bool } from 'prop-types';
import Checkbox from '@material-ui/core/CheckBox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import PizzaIcon from '@material-ui/icons/LocalPizza';
import IconButton from '@material-ui/core/IconButton';
import styles from './styles.scss';

const MultiEditActionBar = ({
  selectedItemsCount,
  itemType,
  itemsRecognized,
  onSelectAllChange,
  onAddToExistingEntityClick,
  onAddNewEntityClick,
  onDeleteItemClick
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
        <div className={styles.bulkFaceEditActions}>
          <Tooltip title="Add to an Existing Entity" placement="bottom-start">
            <IconButton
              classes={{ root: styles.bulkFaceEditActionButton }}
              onClick={onAddToExistingEntityClick}
            >
              <PizzaIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Create New Entity" placement="bottom-start">
            <IconButton
              classes={{ root: styles.bulkFaceEditActionButton }}
              onClick={onAddNewEntityClick}
            >
              <CreateIcon />
            </IconButton>
          </Tooltip>
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
            <IconButton
              classes={{ root: styles.bulkFaceEditActionButton }}
              onClick={onDeleteItemClick}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
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
  onDeleteItemClick: func
};

export default MultiEditActionBar;
