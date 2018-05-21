import React from 'react';
import { string, func } from 'prop-types';

import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableRow } from 'material-ui/Table';

import classes from './styles.scss';

const PersonalInfo = ({
    firstName,
    lastName,
    email,
    handleChangeModalToggle
}) => {
    const name  = `${firstName} ${lastName}`;
    return (
        <div className={classes.container}>
            <div className={classes.context}>
                <h2 className={classes.header}>Your Personal info</h2>
                <p className={classes.subHeader}>Manage this basic information - your name and email.</p>
                <Paper className={classes.infoBoxes}>
                    <Table className={classes.infoTable}>
                        <TableBody>
                            <TableRow className={classes.infoRow}>
                                <TableCell className={classes.rowLabel}>Name</TableCell>
                                <TableCell className={classes.rowData}>{name}</TableCell>
                                <TableCell className={classes.iconHolder} ><i onClick={handleChangeModalToggle} className={`icon-mode_edit2 ${classes.icon}`}/></TableCell>
                            </TableRow>
                            <TableRow className={classes.infoRow}>
                                <TableCell className={classes.rowLabel}>Email</TableCell>
                                <TableCell className={classes.rowData}>{email}</TableCell>
                                <TableCell/>
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
    lastName: string,
    handleChangeModalToggle: func.isRequired
}

export default PersonalInfo;