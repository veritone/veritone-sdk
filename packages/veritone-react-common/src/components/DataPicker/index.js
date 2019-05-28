import React from 'react';
import { func, string, array, bool, arrayOf, shape, number } from 'prop-types';
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
    onSelect: func,
    onRejectFile: func,
    onDeleteFile: func,
    isError: bool,
    percentageUploadingFiles: arrayOf(shape({
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
    currentPickerType: 'folder',
    supportedFormats: [
      'audio/mp4', 'audio/mpeg',
      'video/api', 'video/mp4', 'video/ogg',
      'text/css', 'text/txt', 'text/html',
      'image/jpg', 'image/png', 'image/gif', 'image/webp'
    ],
    percentageUploadingFiles: []
  }

  render() {
    // const { currentPickerType, viewType } = this.state;
    const {
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
      onSelect,
      onUpload,
      onRejectFile,
      onDeleteFile,
      percentageUploadingFiles,
      toggleFolderView,
      toggleStreamView,
      toggleUploadView,
      isLoaded,
      currentPickerType,
      isError,
      currentViewType,
      toggleViewType
    } = this.props;

    return (
      <div className={styles['data-picker-container']}>
        <LeftNavigationPanel
          showFolder
          showStream
          showUpload
          currentPickerType={currentPickerType}
          toggleFolderView={toggleFolderView}
          toggleStreamView={toggleStreamView}
          toggleUploadView={toggleUploadView}
        />
        <div className={styles['data-picker-content-container']}>
          <HeaderBar
            viewType={currentViewType}
            onToggleView={toggleViewType}
            currentPickerType={currentPickerType}
            onUpload={toggleUploadView}
            onBack={toggleFolderView}
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
                        accept={supportedFormats}
                        onCancel={onCancel}
                        onUpload={onUpload}
                        onSelect={onSelect}
                        onReject={onRejectFile}
                        onDeleteFile={onDeleteFile}
                        percentageUploadingFiles={percentageUploadingFiles}
                        containerStyle={{ height: 475}}
                      />
                    </Paper>
                  )
                case 'folder':
                  return (
                      <FolderViewContainer
                        items={items}
                        viewType={currentViewType}
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

export default  DataPicker;
