import React from 'react';
import cx from 'classnames';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add'

import styles from './FormListPage.scss';

export default function FormListPage({
  templates,
  forms,
}) {
  return (
    <Container className={styles.rootContainer}>
      <Container className={cx(
        styles.templateContainer
      )}>
        <Box
          display="flex"
          justifyContent="space-between"
        >
          <Typography variant="h5">
            Start a new form
          </Typography>
          <Typography>
            View all templates
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid
            item
            lg={2}
            md={2}
            xs={2}
          >
            <div className={styles.blankTemplate}>
              <Add className={styles.largeIcon} />
            </div>
            <Typography>Blank</Typography>
          </Grid>
          {
            templates.slice(0, 5).map(({ id, name, imageUrl }) => (
              <Grid
                item
                key={id}
                lg={2}
                md={2}
                xs={2}
              >
                <div className={styles.blankTemplate}>
                  <img style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%',
                    height: 'auto',
                    minHeight: 150,
                  }} />
                </div>
                <Typography>{name}</Typography>
              </Grid>
            ))
          }
        </Grid>
      </Container>
    </Container>
  )
}
