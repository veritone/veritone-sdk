import React, { Fragment } from 'react';
import { startsWith } from 'lodash';
import { string, number } from 'prop-types';

import Snippet from '../Snippet';

const TranscriptChunk = ({ startTime, endTime, data }) => {
  let snippets = convertTranscript(data).map((snippet, index) => {
    return <Snippet key={index} text={snippet.text}/>
  });
  return <Fragment>{snippets}</Fragment>
}

TranscriptChunk.propTypes = {
  startTime: number,
  endTime: number,
  data: string
};

export default TranscriptChunk;

function toSeconds(timeString) {
  let parts = timeString.split(':'),
    h = parseFloat(parts[0]) * 3600,
    m = parseFloat(parts[1]) * 60,
    s = parseFloat(parts[2]);
  return parseFloat((h + m + s).toFixed(3));
}

function convertTranscript(xmlData) {
  let snippetRegex = /<p begin="([^"]+)" end="([^"]+)">([^<]+)<\/p>/g;
  let snippetRegexSingle = /<p begin="([^"]+)" end="([^"]+)">([^<]+)<\/p>/;
  let snippets = [];

  let matches = xmlData.match(snippetRegex);

  if (!matches || !matches.length) {
    return snippets;
  }

  let i,
    max = matches.length;
  for (i = 0; i < max; i++) {
    let match = snippetRegexSingle.exec(matches[i]);
    if (startsWith(match[3], 'AUTOMATIC CLOSED CAPTIONING provided by the Microsoft')) {
      continue;
    }
    snippets.push({
      startTime: match[1],
      start: toSeconds(match[1]),
      endTime: match[2],
      end: toSeconds(match[2]),
      text: match[3]
    });
  }

  return snippets;
}