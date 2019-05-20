import React from 'react';
import { func, string, array, bool } from 'prop-types';
import LeftNavigationPanel from '../LeftNavigationPanel';
import FolderViewContainer from '../FolderViewContainer';
import FilePicker from '../FilePicker';
import HeaderBar from '../HeaderBar';
import styles from './styles.scss';


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
    const { triggerPagination, items, onSelectItem, onCancel, supportedFormats, isLoading } = this.props;

    console.log(this.state);

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
        <div style={{ flexBasis: 700 }}>
          <HeaderBar
            viewType={viewType}
            onToggleView={this.toggleViewType}
            currentPickerType={currentPickerType}
            onUpload={() => this.toggleContentView('upload')}
            onBack={() => this.toggleContentView('folder')}
          />
          {
            currentPickerType === 'upload' ? (
              <FilePicker
                multiple
                accept={supportedFormats}
                onRequestClose={onCancel}
                width={700}
                height={475}
              />
            ) : (
              <FolderViewContainer
                items={items}
                viewType={viewType}
                triggerPagination={triggerPagination}
                onSelectItem={onSelectItem}
                onCancel={onCancel}
                isLoading={isLoading}
              />
            )
          }
        </div>
      </div>
    )
  }

}

export default DataPicker;
