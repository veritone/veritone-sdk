import r from 'regenerator-runtime/runtime';
window.regeneratorRuntime = r;

export VeritoneApp from './shared/VeritoneApp';
export AppBar, { AppBarWidget } from './widgets/AppBar';
export OAuthLoginButton, {
  OAuthLoginButtonWidget
} from './widgets/OAuthLoginButton';
export FilePicker, { FilePickerWidget } from './widgets/FilePicker';
export { EngineSelectionWidget } from './widgets/EngineSelection';
export { TableWidget } from './widgets/Table';
export {
  GlobalNotificationDialog,
  GlobalSnackBar
} from './widgets/Notifications';
export notificationsReducer, * as notificationsModule from './redux/modules/notifications';
// export ContentTemplate from './widgets/ContentTemplate';
// export ContentTemplateForm from './widgets/ContentTemplateForm';
// export SourceManagementForm from './widgets/SourceManagementForm';
// export SourceList from './widgets/SourceList';
export { MediaPlayer } from './widgets/MediaPlayer';
export MediaPlayerControlBar from './widgets/MediaPlayer/DefaultControlBar';
export EngineOutputExport, {
  EngineOutputExportWidget
} from './widgets/EngineOutputExport';
export engineOutputExportReducer, * as engineOutputExportModule from './redux/modules/engineOutputExport';
// export SDOTable from './widgets/SDOTable';
// export IngestionJobsList from './widgets/IngestionJobsList';
export { SchedulerWidget } from './widgets/Scheduler';
// export IngestionAdapters from './widgets/IngestionAdapters';
export { DatasetAdderWidget } from './widgets/DatasetAdder';
