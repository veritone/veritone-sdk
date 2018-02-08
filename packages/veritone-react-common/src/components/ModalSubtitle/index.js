import React from 'react';
import Typography from 'material-ui/Typography';

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


export default ModalSubtitle;
