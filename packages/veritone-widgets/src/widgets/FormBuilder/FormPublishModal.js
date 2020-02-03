import React from 'react';
import { func, bool, objectOf, arrayOf, string, shape, oneOfType, number } from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import useStyles from './FormPublishModal.style.js';

export default function FormPublishModal({
  fetchLocations,
  locationLoading,
  locationLoaded,
  locations,
  selectedLocations,
  onClose,
  onChange,
  onPublish
}) {
  React.useEffect(() => {
    if (!(locationLoading || locationLoaded)) {
      fetchLocations();
    }
  }, []);

  const onSelectBox = React.useCallback((event) => {
    const { id } = event.currentTarget.dataset;
    onChange({
      ...selectedLocations,
      [id]: !selectedLocations[id]
    });
  }, [selectedLocations, onChange]);

  const onSelectAll = React.useCallback((event) => {
    const { checked } = event.target;
    onChange(Object.keys(selectedLocations).reduce((l, id) => ({
      ...l,
      [id]: checked
    }), {}))
  }, [selectedLocations, onChange]);

  const styles = useStyles({});

  const numberSelectedLocations = Object.keys(selectedLocations)
    .filter(id => selectedLocations[id])
    .length;

  return (
    <Dialog
      open
      onClose={onClose}
    >
      <DialogTitle className={styles.dialogTitle}>
        Publish Form
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <DialogContentText>
          <Typography variant="caption">
            Make this form available to other users of your organization. Before you publish, select the location(s) that this form will appear in your Veritone apps.
          </Typography>
        </DialogContentText>
        {
          (locationLoading ? (
            <CircularProgress className={styles.dialogLoading} />
          ) : (locations.length === 0) ? (
            "No locations found"
          ) :
              <div>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  display="block"
                >
                  Available Locations
                </Typography>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={locations.length === numberSelectedLocations}
                          indeterminate={numberSelectedLocations > 0 && numberSelectedLocations < locations.length}
                          onChange={onSelectAll}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          All locations
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {
                      locations.map(({ id, name }) => (
                        <TableRow key={id} data-id={id} onClick={onSelectBox}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={Boolean(selectedLocations[id])}
                              color="primary"
                            />
                          </TableCell>
                          <TableCell>{name}</TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </div>
          )
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={onPublish}>
          Publish
        </Button>
      </DialogActions>
    </Dialog>
  )
}

FormPublishModal.propTypes = {
  locations: arrayOf(shape({
    id: oneOfType([string, number]),
    name: string
  })),
  selectedLocations: objectOf(bool),
  fetchLocations: func,
  locationLoading: bool,
  locationLoaded: bool,
  onClose: func,
  onChange: func,
  onPublish: func
}

FormPublishModal.defaultProps = {
  locations: [],
  selectedLocations: {},
  fetchLocations: () => { }
}
