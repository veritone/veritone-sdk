import React from 'react';
import { func, string, array, bool } from 'prop-types';
import { Paper } from '@material-ui/core'
import LeftNavigationPanel from '../LeftNavigationPanel';
import FolderViewContainer from '../FolderViewContainer';
import FilePicker from '../FilePicker';
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
    supportedFormats: array
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
    currentPickerType: 'folder',
    viewType: 'list'
  }

  toggleContentView = (pickerType) => {
    this.setState({
      currentPickerType: pickerType
    })
  }

  toggleViewType = (event) => {
    this.setState({
      viewType: event.currentTarget.dataset.type
    })
  }

  render() {
    const { currentPickerType, viewType } = this.state;
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
      onSort
    } = this.props;

    return (
      <div className={styles['data-picker-container']}>
        <LeftNavigationPanel
          showFolder
          showStream
          showUpload
          currentPickerType={currentPickerType}
          toggleFolderView={() => this.toggleContentView('folder')}
          toggleStreamView={() => this.toggleContentView('stream')}
          toggleUploadView={() => this.toggleContentView('upload')}
        />
        <div className={styles['data-picer-content-container']}>
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
                    <FilePicker
                      multiple
                      accept={supportedFormats}
                      onRequestClose={onCancel}
                      height={475}
                      width="100%"
                    />
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
