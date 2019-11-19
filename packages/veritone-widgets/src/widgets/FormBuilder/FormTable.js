import React from 'react';

import { arrayOf, func, number, bool, string, shape } from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
// import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Lozenge } from 'veritone-react-common';

import useStyles from './FormTable.style.js';

export default function FormTable({
  forms,
  onChangeRowsPerPage,
  onChangePage,
  rowsPerPage,
  onEdit,
  onDelete,
  page,
  isTemplate
}) {
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const [rowId, setRowId] = React.useState(null);
  const showMenu = React.useCallback((event) => {
    const { id } = event.currentTarget.dataset;
    setMenuAnchor(event.currentTarget);
    event.stopPropagation();
    setRowId(id);
  }, []);
  const gotoForm = React.useCallback((event) => {
    const { id } = event.currentTarget.dataset;
    onEdit(id);
  });
  const handleMenuClose = React.useCallback(() => {
    setMenuAnchor(null);
  });
  const handleEdit = React.useCallback(() => {
    onEdit(rowId);
    setMenuAnchor(null);
  })
  const handleDelete = React.useCallback(() => {
    onDelete(rowId);
    setMenuAnchor(null);
  });

  const styles = useStyles({});

  return (
    <React.Fragment>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{isTemplate ? 'Template' : 'Form'} name</TableCell>
            <TableCell>Last modified</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {
            forms.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
              .map(({ id, name, lastModified, isNew, isPublished }) => (
                <TableRow
                  key={id}
                  onClick={gotoForm}
                  data-id={id}
                  className={styles.tableRow}
                >
                  <TableCell>
                    {name}
                    {
                      isNew ? (
                        <Lozenge backgroundColor="red">Not saved</Lozenge>
                      ) : isPublished ? (
                        <Lozenge>Published</Lozenge>
                      ) : (
                            <Lozenge>Draft</Lozenge>
                          )
                    }
                  </TableCell>
                  <TableCell>
                    {lastModified}
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    <IconButton onClick={showMenu} data-id={id}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
          }
        </TableBody>
        <TableFooter>
          <TableRow>
            {/* <TablePagination
              rowsPerPageOptions={[10, 20, 30]}
              colSpan={3}
              count={forms.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: false,
                variant: 'outlined'
              }}
              onChangeRowsPerPage={onChangeRowsPerPage}
              onChangePage={onChangePage}
            /> */}
          </TableRow>
        </TableFooter>
      </Table>
      <Menu
        open={Boolean(menuAnchor)}
        anchorEl={menuAnchor}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </React.Fragment>
  )
}

const noop = () => { };

FormTable.propTypes = {
  onChangePage: func,
  onChangeRowsPerPage: func,
  onEdit: func,
  onDelete: func,
  forms: arrayOf(shape({
    id: string,
    name: string,
    isNew: bool,
    isPublished: bool,
  })),
  isTemplate: bool,
  page: number,
  rowsPerPage: number
}

FormTable.defaultProps = {
  onChangePage: noop,
  onChangeRowsPerPage: noop,
  onEdit: noop,
  onDelete: noop,
}
