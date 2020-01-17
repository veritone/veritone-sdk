import React from 'react';
import Typography from '@material-ui/core/Typography';
import { oneOfType, string, node, arrayOf } from 'prop-types';

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
  children: oneOfType([string, node, arrayOf(node)])
}

export default ModalSubtitle;
