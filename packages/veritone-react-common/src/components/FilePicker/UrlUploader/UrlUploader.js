import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';

import { func, oneOfType, arrayOf, string } from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import styles from './styles.scss';

@withMuiThemeProvider
class UrlUploader extends Component {
  constructor() {
    super();
    this.state = {
      image: '',
      fetchingImage: false,
      uploadError: false,
      uploadSuccess: false
    };
  }

  preventInput = evt => {
    evt.preventDefault();
  };

  handlePaste = evt => {
    this.setState({
      image: '',
      fetchingImage: true
    });
    fetch(evt.clipboardData.getData('Text'))
      .then(response => {
        if (response.status === 200 || response.status === 0) {
          return response.blob();
        } else {
          throw new Error(
            'Error loading: ' + evt.clipboardData.getData('Text')
          );
        }
      })
      .then(responseBlob => {
        let fileReader = new FileReader();
        fileReader.onload = () => {
          this.setState({
            image: fileReader.result,
            fetchingImage: false,
            uploadError: false,
            uploadSuccess: true
          });
        };
        fileReader.readAsDataURL(responseBlob);
        this.props.onUrlUpload(responseBlob);
        return responseBlob;
      })
      .catch(error => {
        this.setState({
          fetchingImage: false,
          uploadError: true,
          uploadSuccess: false
        });
      });
  };

  handleChange = evt => {
    if (this.state.uploadError && !evt.target.value.length) {
      this.setState({
        image: '',
        uploadError: false,
        uploadSuccess: false
      });
    }
  };

  render() {
    return (
      <div className={styles.urlUploader}>
        <FormControl
          className={styles.urlTextField}
          error={this.state.uploadError}
        >
          <InputLabel
            FormControlClasses={{
              error: styles.fileUrlInputError,
              focused: styles.fileUrlInputFocused
            }}
            htmlFor="url-input"
          >
            Paste an Image URL here
          </InputLabel>
          <Input
            classes={{
              root: styles.fileUrlPickerInputRoot,
              input: styles.fileUlrPickerInput,
              inkbar: styles.inkbarStyle
            }}
            id="url-input"
            onKeyPress={this.preventInput}
            onPaste={this.handlePaste}
            onChange={this.handleChange}
          />
        </FormControl>
        {this.state.image.length ? (
          <div className={styles.imageContainer}>
            <div className={styles.fileImage}>
              <img src={this.state.image} />
            </div>
          </div>
        ) : (
          <div className={styles.urlUploaderInfoBox}>
            <span className={styles.correctUrlText}>
              If the URL is correct the image will display here.
            </span>
            <span className={styles.confirmLicenseText}>
              Remember, only use images that you have confirmed that you have
              the license to use
            </span>
          </div>
        )}
      </div>
    );
  }
}

UrlUploader.propTypes = {
  onUrlUpload: func.isRequired,
  accept: oneOfType([arrayOf(string), string])
};

export default UrlUploader;
