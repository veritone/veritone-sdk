import React, { Component, Fragment } from 'react';
import { shape, func, string } from 'prop-types';
import cx from 'classnames';
import Button from '@material-ui/core/Button/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/ModeEdit';

import styles from './styles.scss';

class ImageSelect extends Component {
  static propTypes = {
    input: shape({
      onChange: func.isRequired
    }).isRequired,
    ButtonProps: shape({
      variant: string,
      color: string
    }),
    buttonText: string,
    iconClass: string
  };

  state = {
    imageSrc: null
  };

  fileInputRef = React.createRef();

  handleOnChange = evt => {
    const {
      input: { onChange }
    } = this.props;
    const file = evt.target.files[0];
    const getBase64 = file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    };
    if (file) {
      getBase64(file).then(result => {
        this.setState({
          imageSrc: result
        });
        onChange(file);
        return result;
      });
    }
  };

  handleRemoveImage = () => {
    const {
      input: { onChange }
    } = this.props;
    this.setState(
      {
        imageSrc: null
      },
      () => {
        onChange(null);
        this.fileInputRef.current.value = null;
      }
    );
  };

  render() {
    const {
      input: { value },
      ButtonProps,
      buttonText,
      iconClass
    } = this.props;
    const { imageSrc } = this.state;
    return (
      <div
        className={cx(styles.coverImageContainer, {
          [styles.dashedBorder]: !value && !imageSrc,
          [styles.greyBackground]: imageSrc
        })}
        data-veritone-component="image-input"
      >
        <input
          accept="image/png, image/jpeg, image/jpg, image/bmp, image/gif, image/tif, image/tiff"
          hidden
          id="browse-to-upload-button"
          type="file"
          onChange={this.handleOnChange}
          ref={this.fileInputRef}
          className={styles.hiddenFileInput}
        />
        {!imageSrc && (
          <Fragment>
            <Icon
              className={cx(
                iconClass || 'icon-cloud_upload',
                styles.uploadIcon
              )}
            />
            <label htmlFor="browse-to-upload-button">
              <Button
                {...ButtonProps}
                component="span"
                data-veritone-element="browse-to-upload-button"
              >
                {buttonText || 'Browse to Upload'}
              </Button>
            </label>
          </Fragment>
        )}
        {imageSrc && (
          <div className={styles.imageContainer}>
            <div className={styles.imageOverlayContainer}>
              <img src={imageSrc} />
              <div className={styles.imageOverlay}>
                <IconButton
                  classes={{ root: styles.actionIconButton }}
                  data-veritone-element="delete-image-button"
                  onClick={this.handleRemoveImage}
                >
                  <DeleteIcon />
                </IconButton>
                <label htmlFor="browse-to-upload-button">
                  <IconButton
                    component="span"
                    classes={{ root: styles.actionIconButton }}
                    data-veritone-element="edit-image-button"
                  >
                    <EditIcon />
                  </IconButton>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ImageSelect;
