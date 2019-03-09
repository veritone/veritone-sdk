import { verifyObject, verifyTranscript } from './index';

import * as objectSummary from '../schemas/vtn-standard/object/examples/summary.json';
import * as objectSeries from '../schemas/vtn-standard/object/examples/series.json';
import * as objectFull from '../schemas/vtn-standard/object/examples/full-capability.json';

import * as transcriptBasic from '../schemas/vtn-standard/transcript/examples/basic.json';
import * as transcriptLattice from '../schemas/vtn-standard/transcript/examples/lattice.json';
import * as transcriptBasicWithConfidence from '../schemas/vtn-standard/transcript/examples/confidence.json';

import * as transcriptBasicEmptyWords from '../schemas/vtn-standard/transcript/invalid-examples/basic.empty.words.json';
import * as transcriptBasicNoWords from '../schemas/vtn-standard/transcript/invalid-examples/basic.no.words.json';
import * as transcriptNegativeConfidence from '../schemas/vtn-standard/transcript/invalid-examples/basic.negative.confidence.json';
import * as transcriptStringConfidence from '../schemas/vtn-standard/transcript/invalid-examples/basic.string.confidence.json';
import * as transcriptLatticeWithMissingConfidence from '../schemas/vtn-standard/transcript/invalid-examples/lattice.missing.confidence.json';
import * as transcriptLatticeWithMissingUtterance from '../schemas/vtn-standard/transcript/invalid-examples/lattice.missing.utterance.json';
import * as transcriptLatticeWithNoBestPath from '../schemas/vtn-standard/transcript/invalid-examples/lattice.no.best.path.json';
import * as transcriptLatticeWithUtteranceBelowOne from '../schemas/vtn-standard/transcript/invalid-examples/lattice.utterance.below.one.json';
import * as transcriptBasicWithBrokenHeader from '../schemas/vtn-standard/transcript/invalid-examples/basic.broken.header.json';
import * as transcriptBasicWithBrokenLanguage from '../schemas/vtn-standard/transcript/invalid-examples/basic.invalid.language.json';
import * as transcriptBasicWithBrokenLanguageSeries from '../schemas/vtn-standard/transcript/invalid-examples/basic.invalid.series.language.json';
import * as transcriptNegativeStartTime from '../schemas/vtn-standard/transcript/invalid-examples/basic.negative.startTime.json';


test('it should verify that a valid object summary output passes validation', () => {
  expect(verifyObject(objectSummary)).toEqual(true);
});

test('it should verify that a valid object series output passes validation', () => {
  expect(verifyObject(objectSeries)).toEqual(true);
});

test('it should verify that a valid object output with full capability passes validation', () => {
  expect(verifyObject(objectFull)).toEqual(true);
});

test('it should verify that a basic transcript output passes validation', () => {
  expect(verifyTranscript(transcriptBasic)).toEqual(true);
});

test('it should verify that a basic transcript with a broken header DOES NOT pass validation', () => {
  expect(verifyTranscript(transcriptBasicWithBrokenHeader)).not.toBe(true);
});

test('it should verify that a basic transcript output with no words DOES NOT pass validation', () => {
  expect(verifyTranscript(transcriptBasicNoWords)).not.toBe(true);
});

test('it should verify that a basic transcript output with empty words DOES NOT pass validation', () => {
  expect(verifyTranscript(transcriptBasicEmptyWords)).not.toBe(true);
});

test('it should verify that a basic transcript output with a negative confidence DOES NOT pass validation', () => {
  expect(verifyTranscript(transcriptNegativeConfidence)).not.toBe(true);
});

test('it should verify that a basic transcript output with a string confidence DOES NOT pass validation', () => {
  expect(verifyTranscript(transcriptStringConfidence)).not.toBe(true);
});

test('it should verify that a lattice transcript output with missing confidence DOES NOT pass validation', () => {
  expect(verifyTranscript(transcriptLatticeWithMissingConfidence)).not.toBe(true);
});

test('it should verify that a lattice transcript output with missing utterance DOES NOT pass validation', () => {
  expect(verifyTranscript(transcriptLatticeWithMissingUtterance)).not.toBe(true);
});

test('it should verify that a lattice transcript output with no best path DOES NOT pass validation', () => {
  expect(verifyTranscript(transcriptLatticeWithNoBestPath)).not.toBe(true);
});

test('it should verify that a lattice transcript output with an invalid utterance value DOES NOT pass validation', () => {
  expect(verifyTranscript(transcriptLatticeWithUtteranceBelowOne)).not.toBe(true);
});

test('it should verify that a lattice transcript output with an invalid language value DOES NOT pass validation', () => {
  expect(verifyTranscript(transcriptBasicWithBrokenLanguage)).not.toBe(true);
});

test('it should verify that a lattice transcript output with an invalid language value in a series DOES NOT pass validation', () => {
  expect(verifyTranscript(transcriptBasicWithBrokenLanguageSeries)).not.toBe(true);
});

test('it should verify that a basic transcript output with a negative startTime in a series DOES NOT pass validation', () => {
  expect(verifyTranscript(transcriptNegativeStartTime)).not.toBe(true);
});

test('it should verify that a transcript with lattices output passes validation', () => {
  expect(verifyTranscript(transcriptLattice)).toEqual(true);
});

test('it should verify that a basic transcript with confidence output passes validation', () => {
  expect(verifyTranscript(transcriptBasicWithConfidence)).toEqual(true);
});
