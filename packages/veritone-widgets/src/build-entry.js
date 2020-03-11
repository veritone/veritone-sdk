import r from 'regenerator-runtime/runtime';
window.regeneratorRuntime = r;

export VeritoneApp from './shared/VeritoneApp';
export AppBar, {
  AppBarWidget,
  defaultAppBarZIndex,
  appBarHeight
} from './widgets/AppBar';
export OAuthLoginButton, {
  OAuthLoginButtonWidget
} from './widgets/OAuthLoginButton';
export FilePicker, { FilePickerWidget } from './widgets/FilePicker';
export filePickerReducer, * as filePickerModule from './redux/modules/filePicker';

export FolderTree, { FolderTreeWidget } from './widgets/FolderTree';
export folderTreeReducer, * as folderTreeModule from './redux/modules/folder';
export filePickerSaga from './redux/modules/filePicker/filePickerSaga';
export DataPicker, { DataPickerWidget } from './widgets/DataPicker';
export dataPickerReducer, * as dataPickerModule from './redux/modules/dataPicker';
export dataPickerSaga from './redux/modules/dataPicker/dataPickerSaga';
export { EngineSelectionWidget } from './widgets/EngineSelection';
export { TableWidget } from './widgets/Table';
export {
  GlobalNotificationDialog,
  GlobalSnackBar
} from './widgets/Notifications';
export notificationsReducer, * as notificationsModule from './redux/modules/notifications';
export { MediaPlayer } from './widgets/MediaPlayer';
export MediaPlayerControlBar from './widgets/MediaPlayer/DefaultControlBar';
export MediaPlayerLightbox, {
  MediaPlayerLightboxWidget
} from './widgets/MediaPlayer/Lightbox';
export EngineOutputExport, {
  EngineOutputExportWidget
} from './widgets/EngineOutputExport';
export engineOutputExportReducer, * as engineOutputExportModule from './redux/modules/engineOutputExport';
export engineOutputExportSaga from './redux/modules/engineOutputExport/saga';
export { UserProfileWidget, formNameSpace, formReducer } from './widgets/UserProfile';
export multipleEngineSelectionReducer, * as multipleEngineSelectionModule from './redux/modules/multipleEngineSelection';
export EnginePicker, {
  EnginePickerWidget,
  SelectionInfoPanel,
  SelectionInfoPanelWidget
} from './widgets/EnginePicker';
export { InfinitePicker } from './widgets/EnginePicker/InfinitePicker';
export { reducers, rootSaga } from './redux/configureStore';
