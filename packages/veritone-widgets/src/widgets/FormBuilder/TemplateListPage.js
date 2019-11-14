import React from 'react';

import { arrayOf, shape, number, func, string } from 'prop-types';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import FormTable from './FormTable';

export default function TemplateListPage({
  templates,
  page,
  rowsPerPage,
  onChangePage,
  onChangeRowsPerPage
}) {

  return (
    <Container>
      <Typography>
        Your templates
      </Typography>
      <FormTable
        forms={templates}
        page={page}
        rowsPerPage={rowsPerPage}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        isTemplate
      />
    </Container>
  )
}

TemplateListPage.propTypes = {
  page: number,
  rowsPerPage: number,
  onChangePage: func,
  onChangeRowsPerPage: func,
  templates: arrayOf(shape({
    id: string,
  }))
}
