import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import mime from 'mime-types';
import { isArray } from 'lodash';
import { fromBuffer } from 'file-type/browser';
import { CircularProgress, Box } from '@material-ui/core';
import { func, arrayOf, string, shape, any, bool } from 'prop-types';
import { withStyles } from '@material-ui/styles';

import styles from './styles';

class UrlUploader extends Component {
  static propTypes = {
    onUpload: func.isRequired,
    acceptedFileTypes: arrayOf(string),
    classes: shape({ any }),
    isUploadUrlVideo: bool,
  };

  static defaultProps = {
    acceptedFileTypes: [],
    isUploadUrlVideo: false,
  };

  state = {
    image: '',
    fetchingImage: false,
    uploadError: false,
  };

  preventInput = (evt) => {
    // todo: a "retrieve" button so we can have manual input without pasting
    evt.preventDefault();
  };

  readFile = (responseBlob) => {
    if (this.props.isUploadUrlVideo) {
      const objectURL = URL.createObjectURL(responseBlob);
      const blobToData = (blob) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            this.setState({
              image: objectURL,
              fetchingImage: false,
              uploadError: false,
            });
            return resolve(reader.result);
          };
          reader.readAsArrayBuffer(blob);
        });

      const result = blobToData(responseBlob);
      const videoType = fromBuffer(result);
      return { responseBlob, videoType };
    }

    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.setState({
        image: fileReader.result,
        fetchingImage: false,
        uploadError: false,
      });
    };

    fileReader.readAsDataURL(responseBlob);
    return { responseBlob };
  };

  handlePaste = (evt) => {
    // todo: handle fetchingImage state -- set to a timestamp, show loading > 200ms?
    this.setState({
      image: '',
      fetchingImage: true,
    });

    const imageUrl = evt.clipboardData.getData('Text');
    const { isUploadUrlVideo } = this.props;

    fetch(imageUrl)
      .then((response) => {
        if (response.status === 200 || response.status === 0) {
          return response.blob();
        } else {
          throw new Error(`Error loading: ${imageUrl}`);
        }
      })
      .then((responseBlob) => {
        console.log('responseBlob0', responseBlob);

        if (this.validateFileType(responseBlob.type)) {
          console.log('responseBlob1', responseBlob);
          return responseBlob;
        } else {
          console.log('responseBlob1-err', responseBlob);
          throw new Error(`${imageUrl} did match any of the allowed fileTypes`);
        }
      })
      .then(async (responseBlob) => {
        console.log('responseBlob2', responseBlob);
        return this.readFile(responseBlob);
      })
      .then(({ responseBlob, videoType }) => {
        console.log('responseBlob3', responseBlob, videoType);
        const fileType = videoType.mime;
        console.log('fileType', fileType);
        const extension = mime.extension(fileType);
        console.log('extension', extension);

        // make an attempt to extract a useful filename (if url has an extension),
        // otherwise use the URL.
        // https://stackoverflow.com/questions/14473180/regex-to-get-a-filename-from-a-url
        const tryFilename = isUploadUrlVideo
          ? /(\w+)(\.\w+)+(?!.*(\w+)(\.\w+)+)/
          : /(?=\w+\.\w{3,4}$).+/;
        console.log('tryFilename', tryFilename);

        let urlFileName = imageUrl.match(tryFilename);
        if (isArray(urlFileName) && urlFileName.length > 0) {
          urlFileName = urlFileName[0];
        }
        const fileName = urlFileName || `${imageUrl}.${extension}`;

        console.log('fileName', fileName);

        this.props.onUpload(
          new File([responseBlob], fileName, {
            type: fileType,
          })
        );

        return responseBlob;
      })
      .catch((error) => {
        console.log('error', error);
        // todo: better errors
        this.setState({
          fetchingImage: false,
          uploadError: true,
        });
      });
  };

  handleChange = (evt) => {
    if (this.state.uploadError && !evt.target.value.length) {
      this.setState({
        image: '',
        uploadError: false,
      });
    }
  };

  validateFileType = (fileType) => {
    if (this.props.acceptedFileTypes.length) {
      return this.props.acceptedFileTypes.includes(fileType);
    } else {
      return true;
    }
  };

  render() {
    const { classes, isUploadUrlVideo } = this.props;
    return (
      <div className={classes.urlUploader}>
        <FormControl
          className={classes.urlTextField}
          error={this.state.uploadError}
        >
          <InputLabel
            classes={{
              error: classes.fileUrlInputError,
              focused: classes.fileUrlInputFocused,
            }}
            htmlFor="url-input"
          >
            Paste an {isUploadUrlVideo ? 'Video' : 'Image'} URL here
          </InputLabel>
          <Input
            classes={{
              root: classes.fileUrlPickerInputRoot,
              input: classes.fileUlrPickerInput,
            }}
            id="url-input"
            onKeyPress={this.preventInput}
            onPaste={this.handlePaste}
            onChange={this.handleChange}
          />
        </FormControl>
        {this.state.image.length ? (
          <div className={classes.imageContainer}>
            <div className={classes.fileImage}>
              {isUploadUrlVideo && (
                <video
                  src={this.state.image}
                  className={classes.videoPreview}
                />
              )}

              {!isUploadUrlVideo && <img src={this.state.image} />}
            </div>
          </div>
        ) : (
          <Box pb={8}>
            <div className={classes.urlUploaderInfoBox}>
              <span className={classes.correctUrlText}>
                If the URL is correct the{' '}
                {isUploadUrlVideo ? 'thumbnail of video' : 'image'} will display
                here.
              </span>
              <span className={classes.confirmLicenseText}>
                Remember, only use {isUploadUrlVideo ? 'videos' : 'images'} that
                you have confirmed that you have the license to use
              </span>
            </div>

            {this.state.fetchingImage && isUploadUrlVideo && (
              <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress />
              </Box>
            )}
          </Box>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(UrlUploader);
