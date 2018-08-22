import { getTranscriptLabel } from './TranscriptModal';
import { getFaceLabel } from './FaceModal';
import { getFingerPrintLabel } from './FingerprintModal';
import { getLogoLabel } from './LogoModal';
import { getObjectLabel } from './ObjectModal';
import { getOCRLabel } from './OCRModal';
import { getSentimentLabel } from './SentimentModal';
import { getTagLabel } from './TagModal';

describe('SearchBar Label Tests', function() {
  it('gets a label from a Transcript Modal', function() {
    const transcriptModalState = { search: '"Kobe Bryant"', language: 'en' };
    const label = getTranscriptLabel(transcriptModalState);
    expect(label).toEqual({
      abbreviation: '"Kobe Bryant"',
      full: '"Kobe Bryant"',
      exclude: false
    });
  });

  it('gets a truncated label from a Transcript Modal with a long search string', function() {
    const transcriptModalState = {
      search: '"Kareem Abdul-Jabbar"',
      language: 'en'
    };
    const label = getTranscriptLabel(transcriptModalState);
    expect(label).toEqual({
      abbreviation: '"Kareem Ab...',
      full: '"Kareem Abdul-Jabbar"',
      exclude: false
    });
  });

  it('gets a label from a Face Modal', function() {
    const faceModalState = {
      exclude: false,
      id: '237eca2b-bbd8-4591-a5d3-91d37a458916',
      type: 'entity',
      label: 'Kobe Bryant',
      image: 'LIBRARY_IMAGE',
      description: 'TV-News-Personality'
    };
    const label = getFaceLabel(faceModalState);
    expect(label).toEqual({
      abbreviation: 'Kobe Bryant',
      full: 'Kobe Bryant',
      exclude: false,
      thumbnail: 'LIBRARY_IMAGE'
    });
  });

  it('gets a truncated label from a Face Modal', function() {
    const faceModalState = {
      exclude: false,
      id: '237eca2b-bbd8-4591-a5d3-91d37a458916',
      type: 'entity',
      label: 'Kareem Abdul-Jabbar',
      image: 'LIBRARY_IMAGE',
      description: 'TV-News-Personality'
    };
    const label = getFaceLabel(faceModalState);
    expect(label).toEqual({
      abbreviation: 'Kareem Abd...',
      full: 'Kareem Abdul-Jabbar',
      exclude: false,
      thumbnail: 'LIBRARY_IMAGE'
    });
  });

  it('gets a label with exclude from a Face Modal', function() {
    const faceModalState = {
      exclude: true,
      id: '237eca2b-bbd8-4591-a5d3-91d37a458916',
      type: 'entity',
      label: 'Kobe Bryant',
      image: 'LIBRARY_IMAGE',
      description: 'TV-News-Personality'
    };
    const label = getFaceLabel(faceModalState);
    expect(label).toEqual({
      abbreviation: 'Kobe Bryant',
      exclude: true,
      full: 'Kobe Bryant',
      thumbnail: 'LIBRARY_IMAGE'
    });
  });

  it('gets a label with exclude from a Face Modal', function() {
    const faceModalState = {
      exclude: true,
      id: '237eca2b-bbd8-4591-a5d3-91d37a458916',
      type: 'entity',
      label: 'Kobe Bryant',
      image: 'LIBRARY_IMAGE',
      description: 'TV-News-Personality'
    };
    const label = getFaceLabel(faceModalState);
    expect(label).toEqual({
      abbreviation: 'Kobe Bryant',
      exclude: true,
      full: 'Kobe Bryant',
      thumbnail: 'LIBRARY_IMAGE'
    });
  });

  it('gets a truncated label from a Fingerprint Modal', function() {
    const fingerprintModal = {
      exclude: false,
      id: '17d62b84-8b49-465b-a6be-fe3ea3bc8f05',
      type: 'library',
      label: 'Horizon - Jingle Ball Test',
      image: null,
      description: '1 Item'
    };
    const label = getFingerPrintLabel(fingerprintModal);
    expect(label).toEqual({
      abbreviation: 'Horizon - ...',
      exclude: false,
      full: 'Horizon - Jingle Ball Test',
      thumbnail: null
    });
  });

  it('gets a truncated label with exclude from a Fingerprint Modal', function() {
    const fingerprintModal = {
      id: '17d62b84-8b49-465b-a6be-fe3ea3bc8f05',
      type: 'library',
      label: 'Horizon - Jingle Ball Test',
      exclude: true,
      image: null,
      description: '1 Item'
    };
    const label = getFingerPrintLabel(fingerprintModal);
    expect(label).toEqual({
      abbreviation: 'Horizon - ...',
      exclude: true,
      full: 'Horizon - Jingle Ball Test',
      thumbnail: null
    });
  });

  it('gets a label from a Logo Modal', function() {
    const logoModal = {
      exclude: false,
      id: 'ESPN',
      type: 'custom',
      label: 'ESPN'
    };
    const label = getLogoLabel(logoModal);
    expect(label).toEqual({
      abbreviation: 'ESPN',
      exclude: false,
      full: 'ESPN'
    });
  });

  it('gets a label from a full-text Object Modal', function() {
    const objectModal = {
      exclude: false,
      id: 'basketball',
      type: 'fullText',
      label: 'Basketball'
    };
    const label = getObjectLabel(objectModal);
    expect(label).toEqual({
      abbreviation: 'CONTAINS: Basketball',
      exclude: false,
      full: 'CONTAINS: Basketball'
    });
  });

  it('gets a truncated label from a full-text Object Modal', function() {
    const objectModal = {
      exclude: false,
      id: 'basketball',
      type: 'fullText',
      label: 'Full Metal Jacket'
    };
    const label = getObjectLabel(objectModal);
    expect(label).toEqual({
      abbreviation: 'CONTAINS: Full Metal...',
      exclude: false,
      full: 'CONTAINS: Full Metal Jacket'
    });
  });

  it('gets a label from a Object Modal', function() {
    const objectModal = {
      exclude: false,
      id: 'Basketball',
      type: 'custom',
      label: 'Basketball'
    };
    const label = getObjectLabel(objectModal);
    expect(label).toEqual({
      abbreviation: 'Basketball',
      exclude: false,
      full: 'Basketball'
    });
  });

  it('gets a label from a OCR Modal', function() {
    const ocrModal = { search: 'Optical character recognition' };
    const label = getOCRLabel(ocrModal);
    expect(label).toEqual({
      abbreviation: 'Optical ch...',
      full: 'Optical character recognition'
    });
  });

  it('gets a label from a Sentiment Modal', function() {
    const sentimentModal = { search: 'positive' };
    const label = getSentimentLabel(sentimentModal);
    expect(label).toEqual({
      abbreviation: 'Positive',
      full: 'Positive'
    });
  });

  it('gets a label from a Tag Modal', function() {
    const tagModal = {
      exclude: false,
      id: 'test',
      type: 'custom',
      label: 'test'
    };
    const label = getTagLabel(tagModal);
    expect(label).toEqual({
      abbreviation: 'test',
      full: 'test',
      exclude: false
    });
  });
});
