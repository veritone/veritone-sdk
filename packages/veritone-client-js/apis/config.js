export const endpoints = {
  application: 'application',
  collection: 'collection',
  collectionFolders: 'folder',
  metrics: 'metrics',
  mention: 'mention',
  widget: 'widget',
  dropboxWatcher: 'watcher/dropbox',
  recording: 'recording',
  faceset: 'face-recognition/faceset',
  tasksByRecording: 'recording/tasks',
  recordingFolders: 'recording/folder',
  taskTypeByJob: 'job/task_type',
  job: 'job',
  engine: 'engine',
  search: 'search',
  //reports:  'report',
  batch: 'batch',
  //transcript:  'transcript',
  ingestion: 'ingestion',
  libraries: 'media',
  user: 'admin/current-user',
  graphql: 'graphql'
};

export const headers = {
  metadataHeader: 'X-Veritone-Metadata',
  applicationIdHeader: 'X-Veritone-Application-Id'
};
