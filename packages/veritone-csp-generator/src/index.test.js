import { engineCategoryMapping } from './';

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

test('it should generate a basic face subquery from a face recognition engine category', () => {
  const kobe = {
    exclude: false,
    id: '237eca2b-bbd8-4591-a5d3-91d37a458916',
    type: 'entity',
    label: 'Kobe Bryant',
    image:
      'https://prod-veritone-library.s3.amazonaws.com/2277175f-5a26-4199-bdbc-cff3311297b0/237eca2b-bbd8-4591-a5d3-91d37a458916/profile-1507911101521.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJUCF3BCNMSE5YZEQ%2F20180613%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20180613T001725Z&X-Amz-Expires=900&X-Amz-Signature=993ce0ed9c0b28e6af1c14d24152578a7c5e6ee8fa695f42dc1608bc44e72a5e&X-Amz-SignedHeaders=host',
    description: 'TV-News-Personality'
  };
  expect(
    engineCategoryMapping['6faad6b7-0837-45f9-b161-2f6bf31b7a07'](kobe)
  ).toEqual({
    operator: 'term',
    field: 'face-recognition.series.entityId',
    value: '237eca2b-bbd8-4591-a5d3-91d37a458916',
    not: false
  });
});

test('it should generate a basic object subquery from an object engine category', () => {
  const basketball = { exclude: false, id: 'basketball', type: 'fullText' };
  expect(
    engineCategoryMapping['088a31be-9bd6-4628-a6f0-e4004e362ea0'](basketball)
  ).toEqual({
    operator: 'query_string',
    field: 'object-recognition.series.found.fulltext',
    value: '*basketball*',
    not: false
  });
});
