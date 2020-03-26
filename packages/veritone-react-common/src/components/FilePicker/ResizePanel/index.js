/* eslint-disable react/jsx-no-bind */
import React from 'react';
import _ from 'lodash';
import { shape, func, number, string, any, bool } from 'prop-types';

import Cropper from 'react-cropper';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import 'cropperjs/dist/cropper.css';
import styles from './styles';

const useStyles = makeStyles(styles);

function App({ file, onSubmit }) {
  const classes = useStyles();
  const [src, setSrc] = React.useState();
  const [cropResult, setCropResult] = React.useState(null);
  let appCropper = undefined;
  const cropImage = () => {
    if (_.isUndefined(appCropper.getCroppedCanvas())) {
      return;
    }
    setCropResult(appCropper.getCroppedCanvas().toDataURL());
  }
  React.useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      setSrc(reader.result);
    };
    reader.readAsDataURL(file);
    return () => {
      setSrc();
    }
  }, [file]);

  React.useEffect(() => {
    console.log(cropResult);
    onSubmit();
  }, [cropResult]);

  return (
    <div className={classes.cropContainer}>
      {src && (
        <Cropper
          style={{ height: 480, width: 640 }}
          preview=".img-preview"
          guides={false}
          src={src}
          ref={cropper => { appCropper = cropper; }}
          zoomable={false}
        />
      )}
      <Button onClick={cropImage}>
        Crop Image
      </Button>
    </div>
  );
}

App.propTypes = {
  file: shape({
    lastModified: number,
    name: string,
    size: number,
    type: string,
    webkitRelativePath: string
  }).isRequired,
  onSubmit: func.isRequired
}

export default App;
