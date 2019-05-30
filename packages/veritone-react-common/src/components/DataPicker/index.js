import React from 'react';
import { func, string, array, bool, arrayOf, shape, number, object } from 'prop-types';
import Paper from '@material-ui/core/Paper'
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
    showFolder: bool,
    showStream: bool,
    showUpload: bool,
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
    onRejectFile: func,
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
    pathList: [{ id: 'root' }],
    supportedFormats: [
      'audio/mp4', 'audio/mpeg',
      'video/api', 'video/mp4', 'video/ogg',
      'text/css', 'text/txt', 'text/html',
      'image/jpg', 'image/png', 'image/gif', 'image/webp'
    ]
  }

  state = {
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

  render() {
    const { viewType } = this.state;
    const {
      showFolder,
      showStream,
      showUpload,
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
      onRejectFile,
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
        <LeftNavigationPanel
          showFolder={showFolder}
          showStream={showStream}
          showUpload={showUpload}
          currentPickerType={currentPickerType}
          toggleFolderView={() => this.toggleContentView('folder')}
          toggleStreamView={() => this.toggleContentView('stream')}
          toggleUploadView={() => this.toggleContentView('upload')}
        />
        <div className={styles['data-picker-content-container']}>
          <HeaderBar
            viewType={viewType}
            onToggleView={this.toggleViewType}
            currentPickerType={currentPickerType}
            onUpload={() => this.toggleContentView('upload')}
            onBack={() => this.toggleContentView('folder')}
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
                        onReject={onRejectFile}
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
                        items={items}
                        viewType={viewType}
                        triggerPagination={triggerPagination}
                        onSelectItem={onSelectItem}
                        onCancel={onCancel}
                        isLoading={isLoading}
                        isLoaded={isLoaded}
                        isError={isError}
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
