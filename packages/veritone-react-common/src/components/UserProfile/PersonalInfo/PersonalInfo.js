import React from 'react';
import { string } from 'prop-types';

import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import classes from './styles.scss';

const PersonalInfo = ({firstName, lastName, email}) => {

    const name  = `${firstName} ${lastName}`;
    return (
        <div className={classes.container}>
            <div className={classes.context}>
                <h2>Your Personal info</h2>
                <p>Manage this basic information - your name and email.</p>
                <Paper className={classes.infoBoxes}>
                    <Table className={classes.infoTable}>
                        <TableBody>
                            <TableRow className={classes.infoRow}>
                                <TableCell className={classes.rowLabel}>Name</TableCell>
                                <TableCell >{name}</TableCell>
                                <TableCell><i className='icon-mode_edit2' /></TableCell>
                            </TableRow>
                            <TableRow className={classes.infoRow}>
                                <TableCell className={classes.rowLabel}>Email</TableCell>
                                <TableCell >{email}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        </div>
    )
}

PersonalInfo.propTypes = {
    email: string.isRequired,
    firstName: string,
    lastName: string
}

export default PersonalInfo;