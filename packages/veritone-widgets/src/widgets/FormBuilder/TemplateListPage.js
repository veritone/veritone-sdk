import React from 'react';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import FormTable from './FormTable';

export default function TemplateListPage({
  templates,
  page,
  rowsPerpage,
  onChangePage,
  onChangeRowsPerpage
}) {
  return (
    <Container>
      <Typography>
        Your templates
      </Typography>
      <FormTable
        forms={templates}
        page={page}
        rowsPerPage={rowsPerpage}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerpage}
        isTemplate
      />
    </Container>
  )
}
