import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';

import {
    string
  } from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import styles from './styles.scss';

@withMuiThemeProvider
class UrlUploader extends Component {
    preventInput = (evt) => {
        evt.preventDefault();
    }

    handlePaste = (evt) => {
        console.log(evt);
        console.log(evt.target);
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
                        onKeyPress={this.preventInput}
                        onPaste={this.handlePaste}
                    />
                </FormControl>
                <div className={styles.urlUploaderInfoBox}>
                    <span className={styles.correctUrlText}>If the URL is correct the image will
                    display here.</span>
                    <span className={styles.confirmLicenseText}>Remember, only use images that you 
                    have confirmed that you have the license to use</span>
                </div>
            </div>
        );
    }
}

export default UrlUploader;