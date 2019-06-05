import React from 'react';
import { func, string, bool, arrayOf, shape, number, object, oneOfType } from 'prop-types';
import { isArray } from 'lodash';
import Paper from '@material-ui/core/Paper'
import LeftNavigationPanel from './LeftNavigationPanel';
import FolderViewContainer from './FolderViewContainer';
import UploaderViewContainer from './UploaderViewContainer';
import HeaderBar from './HeaderBar';
import styles from './styles.scss';

const StreamView = () => (
  <Paper>
    <div style={{ width: '100%', height: 465 }}>Stream view</div>;
  </Paper>
)
const UNSUPPORTED_FORMAT_ERROR = 'Unsupported format detected';
const MAX_ITEM_ERROR = 'Max selected items allowed has been exceeded: ';
const MULTIPLE_ERROR = 'Only one file is allowed';

class DataPicker extends React.Component {
  static propTypes = {
    availablePickerTypes: arrayOf(string),
    currentPickerType: string,
    setPickerType: func.isRequired,
    triggerPagination: func.isRequired,
    items: arrayOf(object),
    onSelectItem: func,
    multiple: bool,
    maxItems: number,
    isLoaded: bool,
    isLoading: bool,
    onSort: func,
    onCrumbClick: func,
    pathList: arrayOf(object),
    onSearch: func,
    onClear: func,
    onUpload: func,
    handleAbort: func,
    onRetryDone: func,
    retryRequest: func,
    uploadPickerState: string,
    uploadStatusMsg: string,
    uploadSuccess: oneOfType([string, bool]),
    uploadError: oneOfType([string, bool]),
    uploadWarning: oneOfType([string, bool]),
    onCancel: func,
    supportedFormats: arrayOf(string),
    isError: bool,
    onErrorMsg: func,
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
    supportedFormats: [],
    uploadStatusMsg: '',
    uploadSuccess: '',
    uploadError: '',
    uploadWarning: ''
  }

  state = {
    uploadedFiles: [],
    viewType: 'list'
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

  handleFilesSelected = fileOrFiles => {
    const {
      multiple,
      maxItems,
      onErrorMsg
    } = this.props;
    const {
      uploadedFiles
    } = this.state;

    const selectedFiles = isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
    const totalFileCount = uploadedFiles.length + selectedFiles.length;
    if (multiple) {
      if (maxItems && totalFileCount > maxItems) {
        onErrorMsg && onErrorMsg(MAX_ITEM_ERROR + maxItems)();
        return;
      }
    } else {
      if (totalFileCount > 1) {
        onErrorMsg && onErrorMsg(MULTIPLE_ERROR)();
        return;
      }
    }
    this.setState({
      uploadedFiles: [...uploadedFiles, ...selectedFiles]
    });
  };

  handleRemoveFile = index => {
    const {
      uploadedFiles
    } = this.state;
    if (uploadedFiles[index]) {
      const clonedFiles = uploadedFiles.slice();
      clonedFiles.splice(index, 1);
      this.setState({
        uploadedFiles: clonedFiles
      });
    }
  }

  handleOnUpload = () => {
    const {
      onUpload
    } = this.props;
    const {
      uploadedFiles
    } = this.state;
    onUpload && onUpload(uploadedFiles);
    this.setState({ uploadedFiles: [] });
  }

  handleOnSelectItem = selectedNodes => {
    const {
      multiple,
      maxItems,
      onSelectItem,
      onErrorMsg
    } = this.props;
    if (multiple) {
      if (maxItems && maxItems < selectedNodes.length) {
        onErrorMsg(MAX_ITEM_ERROR + maxItems)();
        return;
      }
    } else {
      if (selectedNodes.length > 1) {
        onErrorMsg(MULTIPLE_ERROR)();
        return;
      }
    }
    onSelectItem && onSelectItem(selectedNodes);
  }

  render() {
    const { viewType } = this.state;
    const {
      availablePickerTypes,
      currentPickerType,
      triggerPagination,
      items,
      onCancel,
      supportedFormats,
      isLoading,
      pathList,
      onCrumbClick,
      onSearch,
      onClear,
      onSort,
      multiple,
      maxItems,
      handleAbort,
      onRetryDone,
      retryRequest,
      uploadPickerState,
      uploadStatusMsg,
      uploadSuccess,
      uploadError,
      uploadWarning,
      percentByFiles,
      isLoaded,
      isError,
      onErrorMsg
    } = this.props;
    const {
      uploadedFiles
    } = this.state;
    const showHeader = availablePickerTypes.includes('folder');

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
          { showHeader && (
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
          )}
          {
            (() => {
              switch (currentPickerType) {
                case 'upload':
                  return (
                    <Paper>
                      <UploaderViewContainer
                        multiple={multiple}
                        maxItems={maxItems}
                        uploadPickerState={uploadPickerState}
                        uploadStatusMsg={uploadStatusMsg}
                        uploadSuccess={uploadSuccess}
                        uploadWarning={uploadWarning}
                        uploadError={uploadError}
                        accept={supportedFormats}
                        onCancel={onCancel}
                        onUpload={this.handleOnUpload}
                        onFilesSelected={this.handleFilesSelected}
                        handleAbort={handleAbort}
                        onRetryDone={onRetryDone}
                        retryRequest={retryRequest}
                        onReject={onErrorMsg(UNSUPPORTED_FORMAT_ERROR)}
                        uploadedFiles={uploadedFiles}
                        onRemoveFile={this.handleRemoveFile}
                        percentByFiles={percentByFiles}
                        containerStyle={{ height: 475}}
                      />
                    </Paper>
                  )
                case 'folder':
                  return (
                      <FolderViewContainer
                        multiple={multiple}
                        maxItems={maxItems}
                        availablePickerTypes={availablePickerTypes}
                        toggleContentView={this.toggleContentView}
                        supportedFormats={supportedFormats}
                        items={items}
                        viewType={viewType}
                        triggerPagination={triggerPagination}
                        onSelectItem={this.handleOnSelectItem}
                        onCancel={onCancel}
                        isLoading={isLoading}
                        isLoaded={isLoaded}
                        isError={isError}
                        onError={onErrorMsg(UNSUPPORTED_FORMAT_ERROR)}
                      />
                  )
                case 'stream':
                    return <StreamView />

              default:
                return null;
            }})()
          }
        </div>
      </div>
    )
  }
}

export default DataPicker;
