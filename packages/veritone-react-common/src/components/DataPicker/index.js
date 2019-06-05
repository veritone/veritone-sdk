import React from 'react';
import { func, string, array, bool, arrayOf, shape, number, object } from 'prop-types';
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import LeftNavigationPanel from '../LeftNavigationPanel';
import FolderViewContainer from '../FolderViewContainer';
import UploaderViewContainer from '../UploaderViewContainer';
import HeaderBar from '../HeaderBar';
import styles from './styles.scss';

const StreamView = () => (
  <Paper>
    <div style={{ width: '100%', height: 465 }}>Stream view</div>;
  </Paper>
)

class DataPicker extends React.Component {
  static propTypes = {
    setPickerType: func.isRequired,
    triggerPagination: func.isRequired,
    items: array,
    onSelectItem: func,
    isLoaded: bool,
    isLoading: bool,
    onSort: func,
    onCrumbClick: func,
    pathList: array,
    onCancel: func,
    supportedFormats: array,
    onFilesSelected: func,
    onRemoveFile: func,
    isError: bool,
    uploadedFiles: arrayOf(object),
    percentByFiles: arrayOf(shape({
      key: string,
      value: shape({
        name: string,
        percent: number,
        size: number
      })
    }))
  }

  static defaultProps = {
    items: [],
    pathList: [],
    supportedFormats: [
      'audio/mp4', 'audio/mpeg',
      'video/api', 'video/mp4', 'video/ogg',
      'text/css', 'text/txt', 'text/html',
      'image/jpg', 'image/png', 'image/gif', 'image/webp'
    ]
  }

  state = {
    viewType: 'list',
    showError: false,
    errorMsg: ''
  }

  toggleContentView = (pickerType) => {
    const { setPickerType } = this.props;
    pickerType && setPickerType && setPickerType(pickerType);
  }

  toggleViewType = (event) => {
    this.setState({
      viewType: event.currentTarget.dataset.type
    })
  }

  handleShowErrorMsg = errorMsg => () => {
    this.setState({
      showError: true,
      errorMsg
    });
  }

  handleCloseErrorMsg = () => {
    this.setState({
      showError: false,
      errorMsg: ''
    });
  }

  render() {
    const { viewType, showError, errorMsg } = this.state;
    const {
      availablePickerTypes,
      currentPickerType,
      triggerPagination,
      items,
      onSelectItem,
      onCancel,
      supportedFormats,
      isLoading,
      pathList,
      onCrumbClick,
      onSearch,
      onClear,
      onSort,
      onFilesSelected,
      onUpload,
      handleAbort,
      onRetryDone,
      retryRequest,
      onRemoveFile,
      uploadPickerState,
      uploadStatusMsg,
      uploadSuccess,
      uploadError,
      uploadWarning,
      uploadedFiles,
      percentByFiles,
      isLoaded,
      isError
    } = this.props;

    return (
      <div className={styles['data-picker-container']}>
        { availablePickerTypes.length > 1 && (
          <LeftNavigationPanel
            availablePickerTypes={availablePickerTypes}
            currentPickerType={currentPickerType}
            toggleContentView={this.toggleContentView}
          />
        )}
        <div className={styles['data-picker-content-container']}>
          <HeaderBar
            viewType={viewType}
            onToggleView={this.toggleViewType}
            currentPickerType={currentPickerType}
            pathList={pathList}
            onCrumbClick={onCrumbClick}
            onSearch={onSearch}
            onClear={onClear}
            onSort={onSort}
          />
          {
            (() => {
              switch (currentPickerType) {
                case 'upload':
                  return (
                    <Paper>
                      <UploaderViewContainer
                        multiple
                        uploadPickerState={uploadPickerState}
                        uploadStatusMsg={uploadStatusMsg}
                        uploadSuccess={uploadSuccess}
                        uploadWarning={uploadWarning}
                        uploadError={uploadError}
                        accept={supportedFormats}
                        onCancel={onCancel}
                        onUpload={onUpload}
                        onFilesSelected={onFilesSelected}
                        handleAbort={handleAbort}
                        onRetryDone={onRetryDone}
                        retryRequest={retryRequest}
                        onReject={this.handleShowErrorMsg('Unsupported format detected')}
                        onRemoveFile={onRemoveFile}
                        uploadedFiles={uploadedFiles}
                        percentByFiles={percentByFiles}
                        containerStyle={{ height: 475}}
                      />
                    </Paper>
                  )
                case 'folder':
                  return (
                      <FolderViewContainer
                        supportedFormats={supportedFormats}
                        items={items}
                        viewType={viewType}
                        triggerPagination={triggerPagination}
                        onSelectItem={onSelectItem}
                        onCancel={onCancel}
                        isLoading={isLoading}
                        isLoaded={isLoaded}
                        isError={isError}
                        onError={this.handleShowErrorMsg('Unsupported format detected')}
                      />
                  )
                case 'stream':
                    return <StreamView />

              default:
                return null;
            }})()
          }
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          open={showError}
          autoHideDuration={5000}
          onClose={this.handleCloseErrorMsg}
        >
          <SnackbarContent
            className={styles['data-picker-error-snack']}
            message={errorMsg}
            action={[
              <IconButton key='close-btn' onClick={this.handleCloseErrorMsg}>
                <CloseIcon />
              </IconButton>
            ]}
          />
        </Snackbar>
      </div>
    )
  }
}

export default DataPicker;
