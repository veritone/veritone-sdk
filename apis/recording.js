import validate from './validations';
import { endpoints } from './config';

export default {
	createRecording(recording) {
		validate.recording(recording);

		return {
			method: 'post',
			path: endpoints.recording,
			data: recording
		};
	},

	getRecordings({ offset, limit }) {
		return {
			method: 'get',
			path: endpoints.recording,
			query: { offset, limit }
		};
	},

	getRecording(recordingId) {
		if (
			typeof recordingId !== 'string' &&
			typeof recordingId !== 'number'
		) {
			throw new Error('Missing recordingId!');
		}

		return {
			method: 'get',
			path: `${endpoints.recording}/${recordingId}`
		};
	},

	updateRecording(recording) {
		validate.recording(recording);

		return {
			method: 'put',
			path: `${endpoints.recording}/${recording.recordingId}`,
			data: recording
		}
	},

	updateRecordingFolder(folder) {
		if (typeof folder !== 'object') {
			throw new Error('Missing folder!');
		}
		if (typeof folder.folderId !== 'string' || folder.folderId === '') {
			throw new Error('Missing folder.folderId!');
		}

		return {
			method: 'put',
			path: `${endpoints.recordingFolders}/${folder.folderId}`,
			data: folder
		}
	},

	updateCms(recordingId) {
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}

		return {
			method: 'put',
			path: `${endpoints.recording}/${recordingId}/cms`,
		}
	},

	deleteRecording: (recordingId) => {
		if (typeof recordingId === 'number') {
			recordingId = recordingId + '';
		}
		if (typeof recordingId !== 'string' || recordingId === '') {
			throw new Error('Missing recordingId!');
		}

		return {
			method: 'delete',
			path: `${endpoints.recording}/${recordingId}`
		}
	},

	getRecordingTranscript: () => {},
	getRecordingMedia: () => {},
	getRecordingAssets: () => {},
	getAsset: () => {},
	getAssetMetadata: () => {},
	updateAssetMetadata: () => {},
	saveAssetToFile: () => {},
	createAsset: () => {},
	updateAsset: () => {},
	deleteAsset: () => {}
};
