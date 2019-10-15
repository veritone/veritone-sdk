import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { NullState } from 'veritone-react-common';

export default function FormPublishModal({
  fetchLocations,
  locationLoading,
  loactionLoaded,
  locations,
  selectedLocations,
  onClose,
  onSelect,
  onSelectAll,
  open,
}) {
  React.useEffect(() => {
    if (!(locationLoading || loactionLoaded)) {
      fetchLocations();
    }
  }, []);

  return (
    <Dialog open={open}>
      <DialogTitle>Publish Form</DialogTitle>
      <DialogContent>
        <Typography>
          Make this form available to other users of your organization. Before you publish, select the location(s) that this form will appear in your Veritone apps.
        </Typography>
        {
          (locationLoading ? (
            "Loading"
          ) : (locations.length === 0) ? (
            "No locations found"
          ) :
              <Table>
                <TableHead>
                  <Checkbox
                    inputProps={{ 'aria-label': 'select all desserts' }}
                  />
                </TableHead>
                <TableBody>
                  <TableRow>

                  </TableRow>
                </TableBody>
              </Table>
          )
        }
      </DialogContent>
      <DialogActions>
        <Button>Cancel</Button>
        <Button>Publish</Button>
      </DialogActions>
    </Dialog>
  )

}