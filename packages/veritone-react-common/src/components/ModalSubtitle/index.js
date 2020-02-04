import React from 'react';
import { oneOfType, string, node } from 'prop-types';
import Typography from '@material-ui/core/Typography';

const ModalSubtitle = ({ children }) => (
  <Typography
    style={{ paddingTop: '0.3em' }}
    color="textSecondary"
    gutterBottom
    variant="caption"
  >
    {children}
  </Typography>
);

ModalSubtitle.propTypes = {
  children: oneOfType([string, node]),
};

export default ModalSubtitle;
