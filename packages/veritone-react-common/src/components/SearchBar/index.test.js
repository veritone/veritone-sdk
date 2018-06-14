import { getTranscriptLabel } from './TranscriptModal';

describe('TranscriptLabel', function() {
  it('gets a label from a Transcript Modal', function() {
    const transcriptModalState = { search: '"Kobe Bryant"', language: 'en' };
    const label = getTranscriptLabel(transcriptModalState);
    expect(label).toEqual({
      abbreviation: '"Kobe Bryant"',
      exclude: false,
      thumbnail: null
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
      exclude: false,
      thumbnail: null
    });
  });
});
