import React from 'react';
import { string, func } from 'prop-types';

import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import classes from './styles.scss';

const Password = ({lastUpdated, handleRequestResetModalToggle}) => (
    <div className={classes.container}>
        <div className={classes.context}>
            <h2 className={classes.header}>Signing into Veritone</h2>
            <p className={classes.subHeader}>Control your password and account access.</p>
            <Paper className={classes.infoBoxes}>
                <Table className={classes.infoTable}>
                    <TableBody>
                        <TableRow className={classes.infoRow}>
                            <TableCell className={classes.rowLabel}>Password</TableCell>
                            <TableCell className={classes.rowData}>{lastUpdated}</TableCell>
                            <TableCell className={classes.resetLink} onClick={handleRequestResetModalToggle}>RESET</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        </div>
    </div>
);

Password.propTypes = {
    lastUpdated: string.isRequired,
    handleRequestResetModalToggle: func.isRequired,
}

export default Password;