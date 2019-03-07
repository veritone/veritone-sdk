import { verifyObject } from './index';
import * as objectSummary from '../schemas/vtn-standard/object/examples/summary.json';
import * as objectSeries from '../schemas/vtn-standard/object/examples/series.json';
import * as objectFull from '../schemas/vtn-standard/object/examples/full-capability.json';

test('it should verify that a valid object summary passes validation', () => {
  expect(
    verifyObject(objectSummary)
  ).toEqual(true);
});

test('it should verify that a valid object series passes validation', () => {
  expect(
    verifyObject(objectSeries)
  ).toEqual(true);
});

test('it should verify that a valid object output with full capability passes validation', () => {
  expect(
    verifyObject(objectFull)
  ).toEqual(true);
});

