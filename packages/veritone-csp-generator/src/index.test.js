import { engineCategoryMapping } from '../';

test('it should generate a basic transcript subquery from a transcript engine category', () => {
  const kobe = { search: '"Kobe Bryant"', language: 'en' };
  expect(
    engineCategoryMapping['67cd4dd0-2f75-445d-a6f0-2f297d6cd182'](kobe)
  ).toEqual({
    operator: 'query_string',
    field: 'transcript.transcript',
    value: '"kobe bryant"'
  });
});
