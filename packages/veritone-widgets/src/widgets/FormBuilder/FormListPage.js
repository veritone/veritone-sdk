import React from 'react';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add'

import FormTable from './FormTable';
import FormBuilderDialog from './FormBuilderDialog';
import styles from './FormListPage.scss';

import {
  connectFormBuilder,
  connectFormTable,
  connectFormListPage
} from './connectHOCs';

const ConnectedFormTable = connectFormTable(FormTable);
const ConnectedFormBuilder = connectFormBuilder(FormBuilderDialog);

function FormListPage({
  templates,
  forms,
  page,
  rowsPerPage,
  onChangePage,
  onChangeRowsPerPage,
  fetchForm,
  newForm
}) {
  const [selectedForm, setSelectedForm] = React.useState(null);
  const closeFormDialog = React.useCallback(() => setSelectedForm(null));
  const openNewForm = React.useCallback(() => {
    const newFormId = `form-${Date.now()}`;
    const newFormName = `New ${newFormId}`;
    newForm(newFormId, newFormName);
    setSelectedForm(newFormId);
  });
  return (
    <React.Fragment>
      {
        Boolean(selectedForm) && (
          <ConnectedFormBuilder
            open
            onClose={closeFormDialog}
            id={selectedForm}
          />
        )
      }
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
              <Container className={styles.blankTemplate} onClick={openNewForm}>
                <Add className={styles.largeIcon} />
              </Container>
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
                  <Container
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
                  </Container>
                  <Typography>{name}</Typography>
                </Grid>
              ))
            }
          </Grid>
        </Container>
        <Container className={styles.formContainer}>
          <Typography className={styles.formTitle}>Your forms</Typography>
          <ConnectedFormTable
            forms={forms}
            onEdit={setSelectedForm}
          // onDelete={}
          />
        </Container>
      </Container>

    </React.Fragment>
  )
}

FormListPage.defaultProps = {
  page: 0,
  rowsPerPage: 10
}


export default connectFormListPage(FormListPage);
