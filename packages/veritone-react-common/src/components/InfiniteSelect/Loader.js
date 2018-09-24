import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loader = () => (
  <div style={{ textAlign: 'center', width: '100%' }}>
    <CircularProgress />
  </div>
);

export default Loader;
