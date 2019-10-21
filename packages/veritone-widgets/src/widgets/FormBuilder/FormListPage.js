import React from 'react';
import cx from 'classnames';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add'

import FormTable from './FormTable';
import FormBuilderDialog from './FormBuilderDialog';
import styles from './FormListPage.scss';

export default function FormListPage({
  templates,
  forms,
  page,
  rowsPerPage,
  onChangePage,
  onChangeRowsPerPage,
}) {
  const [selectedForm, setSelectedForm] = React.useState(null);
  const closeFormDialog = React.useCallback(() => setSelectedForm(null));
  const openNewForm = React.useCallback(() => {
    setSelectedForm('new');
  })
  return (
    <React.Fragment>
      <Container className={styles.rootContainer}>
        <Container className={cx(
          styles.templateContainer
        )}>
          <Box
            display="flex"
            justifyContent="space-between"
          >
            <Typography>
              Start a new form
          </Typography>
            <Typography variant="subtitle2">
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
              <div className={styles.blankTemplate} onClick={openNewForm}>
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
                  <div
                    className={styles.blankTemplate}
                    onClick={setSelectedForm}
                  >
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
        <Container className={styles.formContainer}>
          <Typography className={styles.formTitle}>Your forms</Typography>
          <FormTable
            forms={forms}
            page={page}
            rowsPerPage={rowsPerPage}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
            onEdit={setSelectedForm}
          // onDelete={}
          />
        </Container>
      </Container>
      <FormBuilderDialog
        open={Boolean(selectedForm)}
        onClose={closeFormDialog}
      />
    </React.Fragment>
  )
}

FormListPage.defaultProps = {
  page: 0,
  rowsPerPage: 10
}
