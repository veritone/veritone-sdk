import {FaceModal} from '../FaceModal';
import {FingerprintModal} from '../FingerprintModal';
import {GeolocationModal} from '../GeolocationModal';
import {LogoModal} from '../LogoModal';
import {ObjectModal} from '../ObjectModal';
import {OCRModal} from '../OCRModal';
import {SentimentModal} from '../SentimentModal';
import {TagModal} from '../TagModal';
import {StructuredDataModal} from '../StructuredDataModal';
import {TimeModal} from '../TimeModal';
import {TranscriptModal} from '../TranscriptModal';

const transcript = {
  id: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
  name: 'Transcript',
  iconClass: 'icon-transcription',
  title: 'Search by Keyword',
  subtitle: 'Search by keyword within our database of transcripts.'
};
const sentiment = {
  id: 'f2554098-f14b-4d81-9be1-41d0f992a22f',
  name: 'Sentiment',
  iconClass: 'icon-sentiment',
  title: 'Search by Sentiment',
  subtitle: 'Search by positive and negative sentiment in text transcripts.'
};
const fingerprint = {
  id: '17d62b84-8b49-465b-a6be-fe3ea3bc8f05',
  name: 'Fingerprint',
  iconClass: 'icon-finger_print3',
  title: 'Search by Fingerprint',
  subtitle: 'Locate a certain song or advertisement inside of audio files.'
};
const face = {
  id: '6faad6b7-0837-45f9-b161-2f6bf31b7a07',
  name: 'Face',
  iconClass: 'icon-face',
  title: 'Search by Face',
  subtitle: 'Search by known images of people within our database.'
};
const obj = {
  id: '088a31be-9bd6-4628-a6f0-e4004e362ea0',
  name: 'Object',
  iconClass: 'icon-object_detection',
  title: 'Search by Object',
  subtitle: 'Search by objects within our database.'
};
const recognizedText = {
  id: '3b4ac603-9bfa-49d3-96b3-25ca3b502325',
  name: 'Recognized Text',
  iconClass: 'icon-ocr',
  title: 'Search by Recognized Text',
  subtitle: 'Searches within our database for recognized text.'
};
const logo = {
  id: '5a511c83-2cbd-4f2d-927e-cd03803a8a9c',
  name: 'Logo Recognition',
  iconClass: 'icon-logo-detection',
  title: 'Search by Logo',
  subtitle: 'Search by logos within our database.'
};
const tag = {
  id: 'tag-search-id',
  name: 'Tag Search',
  iconClass: 'icon-tag',
  title: 'Search by Tag',
  subtitle: 'Search by tags within our database.'
};
const structured = {
  id: 'sdo-search-id',
  name: 'Structured Data',
  iconClass: 'icon-third-party-data',
  title: 'Search by Structured Data',
  subtitle: 'Search by third party structured data.'
};
const time = {
  id: 'time-search-id',
  name: 'Time Search',
  iconClass: 'icon-calendar',
  title: 'Search by Time',
  subtitle: 'Search by day of week and time within our database.'
};
const geolocation = {
  id: '203ad7c2-3dbd-45f9-95a6-855f911563d0',
  name: 'Geolocation',
  iconClass: 'icon-gps',
  title: 'Search by Geolocation',
  subtitle: 'Locate by City, ZIP Code or DMA.'
};

const engineCategories = [
  transcript,
  face,
  obj,
  logo,
  recognizedText,
  fingerprint, 
  sentiment, 
  geolocation, 
  tag, 
  structured, 
  time];


  const engineCategoryMapToModal = {
    '67cd4dd0-2f75-445d-a6f0-2f297d6cd182': {
      modal: TranscriptModal
    },
    'f2554098-f14b-4d81-9be1-41d0f992a22f': {
      modal: SentimentModal
    },
    '3b4ac603-9bfa-49d3-96b3-25ca3b502325': {
      modal: OCRModal
    },
    '6faad6b7-0837-45f9-b161-2f6bf31b7a07': {
      modal: FaceModal
    },
    '088a31be-9bd6-4628-a6f0-e4004e362ea0': {
      modal: ObjectModal
    },
    '17d62b84-8b49-465b-a6be-fe3ea3bc8f05': {
      modal: FingerprintModal
    },
    '5a511c83-2cbd-4f2d-927e-cd03803a8a9c': {
      modal: LogoModal
    },
    'tag-search-id': {
      modal: TagModal,
    },
    'sdo-search-id': {
      modal: StructuredDataModal
    },
    'time-search-id': {
      modal: TimeModal
    },
    '203ad7c2-3dbd-45f9-95a6-855f911563d0': {
      modal: GeolocationModal
    }
  };


  export {engineCategories, engineCategoryMapToModal}