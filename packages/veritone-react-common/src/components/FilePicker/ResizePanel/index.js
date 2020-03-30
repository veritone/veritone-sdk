/* eslint-disable react/jsx-no-bind */
import React from 'react';
import _ from 'lodash';
import { shape, func, number, string } from 'prop-types';

import Cropper from 'react-cropper';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import 'cropperjs/dist/cropper.css';
import styles from './styles';

const useStyles = makeStyles(styles);

function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function App({ file, onSubmit, onCancel, aspectRatio }) {
  const classes = useStyles();
  const [src, setSrc] = React.useState();
  const [fileName, setFileName] = React.useState('');
  const [cropResult, setCropResult] = React.useState(null);
  let appCropper = undefined;
  const cropImage = () => {
    if (_.isUndefined(appCropper.getCroppedCanvas())) {
      return;
    }
    setCropResult(appCropper.getCroppedCanvas().toDataURL());
  }
  React.useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSrc(reader.result);
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
    }
    return () => {
      setSrc();
      setFileName('');
    }
  }, [file]);

  React.useEffect(() => {
    if (cropResult) {
      const fileTranfered = dataURLtoFile(cropResult, `cropped-${fileName}`);
      onSubmit(fileTranfered);
    }
  }, [cropResult, fileName]);

  return (
    <div className={classes.cropContainer}>
      {src && (
        <Cropper
          style={{ height: 560 / aspectRatio, width: 560 }}
          aspectRatio={aspectRatio}
          guides={false}
          src={src}
          ref={cropper => { appCropper = cropper; }}
          zoomable={false}
        />
      )}
      <div className={classes.resizeFooter}>
        <Button
          className={classes.buttonResize}
          color="primary"
          variant="contained"
          onClick={cropImage}>
          Crop Image
        </Button>
        <Button
          className={classes.buttonResize}
          variant="outlined"
          onClick={onCancel}>
          Cancel
        </Button>
      </div>
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
  onSubmit: func.isRequired,
  onCancel: func.isRequired,
  aspectRatio: number.isRequired
}

export default App;
