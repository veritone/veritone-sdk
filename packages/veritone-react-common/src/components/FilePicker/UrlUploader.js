import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';

import {
    func
  } from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import styles from './styles.scss';

@withMuiThemeProvider
class UrlUploader extends Component {
    state = {
        image: "",
        fetchingImage: false
    }

    preventInput = (evt) => {
        evt.preventDefault();
    }

    handlePaste = (evt) => {
        this.setState({
            image: "",
            fetchingImage: true
        });
        fetch(evt.clipboardData.getData('Text'))
        .then((response) => {
            if (response.status === 200 || response.status === 0) {
                return response.blob();
            } else {
                return Promise.reject(new Error('Error loading: ' + evt.clipboardData.getData('Text')))
            }
        })
        .then((responseBlob) => {
            let fileReader = new FileReader();
            fileReader.onload = () => {
                this.setState({
                    image: fileReader.result,
                    fetchingImage: false
                });
            };
            fileReader.readAsDataURL(responseBlob);
        }, (error) => {
            this.setState({
                fetchingImage: false
            });
        });
    }

    render () {
        return (
            <div className={styles.urlUploader}>
                <FormControl className={styles.urlTextField}>
                    <InputLabel
                        FormControlClasses={{
                            focused: styles.fileUrlInputFocused
                        }}
                        htmlFor="url-input"
                    >
                        Paste an Image URL here
                    </InputLabel>
                    <Input
                        className={styles.fileUrlPickerInput}
                        classes={{
                            inkbar: styles.fileUrlInputInkbar,
                        }}
                        id="url-input"
                        onKeyPress={this.preventInput.bind(this)}
                        onPaste={this.handlePaste.bind(this)}
                    />
                </FormControl>
                {
                    this.state.image.length || this.state.fetchingImage ? 
                        <div className={styles.imageContainer}>
                            <div className={styles.fileImage}>
                                <img src={this.state.image}></img>
                            </div>
                        </div> :
                        <div className={styles.urlUploaderInfoBox}>
                            <span className={styles.correctUrlText}>If the URL is correct the image will
                            display here.</span>
                            <span className={styles.confirmLicenseText}>Remember, only use images that you 
                            have confirmed that you have the license to use</span>
                        </div>
                }
            </div>
        );
    }
}

export default UrlUploader;