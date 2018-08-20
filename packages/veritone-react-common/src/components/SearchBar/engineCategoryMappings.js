import { getTranscriptLabel } from './TranscriptModal';
import { getSentimentLabel } from './SentimentModal';
import { getOCRLabel } from './OCRModal/index';
import { getFingerPrintLabel } from './FingerprintModal/index';
import { getFaceLabel } from './FaceModal/index';
import { getObjectLabel } from './ObjectModal/index';
import { getLogoLabel } from './LogoModal/index';
import { getTagLabel } from './TagModal/index';
import { getStructuredDataLabel } from './StructuredDataModal/index';
import { getTimeLabel } from './TimeModal/index';
import { getGeolocationLabel } from './GeolocationModal/index';

const transcript = {
  name: 'Transcript',
  iconClass: 'icon-transcription',
  getLabel: getTranscriptLabel
};
const sentiment = {
  name: 'Sentiment',
  iconClass: 'icon-sentiment',
  getLabel: getSentimentLabel
};
const ocr = {
  name: 'OCR',
  iconClass: 'icon-ocr',
  getLabel: getOCRLabel
};
const fingerprint = {
  name: 'Fingerprint',
  iconClass: 'icon-finger_print3',
  getLabel: getFingerPrintLabel
};
const face = {
  name: 'Face',
  iconClass: 'icon-face',
  getLabel: getFaceLabel
};
const obj = {
  name: 'Object',
  iconClass: 'icon-object_detection',
  getLabel: getObjectLabel
};
const logo = {
  name: 'Logo Recognition',
  iconClass: 'icon-logo-detection',
  getLabel: getLogoLabel
};
const tag = {
  name: 'Tag Search',
  iconClass: 'icon-tag',
  getLabel: getTagLabel
};
const sdo = {
  name: 'Structured Data',
  iconClass: 'icon-third-party-data',
  getLabel: getStructuredDataLabel
};
const time = {
  name: 'Time Search',
  iconClass: 'icon-calendar',
  getLabel: getTimeLabel
};
const geolocation = {
  name: 'Geolocation',
  iconClass: 'icon-gps',
  getLabel: getGeolocationLabel
};
const engineCategories = {
  '67cd4dd0-2f75-445d-a6f0-2f297d6cd182': transcript,
  'f2554098-f14b-4d81-9be1-41d0f992a22f': sentiment,
  '3b4ac603-9bfa-49d3-96b3-25ca3b502325': ocr,
  '6faad6b7-0837-45f9-b161-2f6bf31b7a07': face,
  '088a31be-9bd6-4628-a6f0-e4004e362ea0': obj,
  '17d62b84-8b49-465b-a6be-fe3ea3bc8f05': fingerprint,
  '5a511c83-2cbd-4f2d-927e-cd03803a8a9c': logo,
  'tag-search-id': tag,
  'time-search-id': time,
  '203ad7c2-3dbd-45f9-95a6-855f911563d0': geolocation,
  'sdo-search-id': sdo
};
export { engineCategories };
