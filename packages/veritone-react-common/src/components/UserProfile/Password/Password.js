import React from 'react';
import { string } from 'prop-types';

import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { format as libFormat } from 'date-fns';

import classes from './styles.scss';

const Password = ({lastUpdatedRaw}) => {
    const lastUpdated = libFormat(lastUpdatedRaw, 'MMMM DD, YYYY');
    return (
        <div className={classes.container}>
            <div className={classes.context}>
                <h2>Signing into Veritone</h2>
                <p>Control your password and account access.</p>
                <Paper className={classes.infoBoxes}>
                    <Table className={classes.infoTable}>
                        <TableBody>
                            <TableRow className={classes.infoRow}>
                                <TableCell className={classes.rowLabel}>Password</TableCell>
                                <TableCell >{lastUpdated}</TableCell>
                                <TableCell><i className='icon-keyboard_arrow_right' /></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        </div>
    )
}

Password.propTypes = {
    lastUpdatedRaw: string.isRequired
}

export default Password;