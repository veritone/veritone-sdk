import React from 'react';
import { mount } from 'enzyme';
import TranslationEngineOutpt from './';

describe('Translation Engine Output', () => {
  let translationEngineOutput = mount(
    <TranslationEngineOutpt
      engines={[{ id: '1', name: 'Engine-X' }, { id: '2', name: 'Engine-Y' }]}
      selectedEngineId="1"
      onRerunProcess={jest.fn()}
      onEngineChange={jest.fn()}
    />
  );

  it('Missing EngineOutputHeader', () => {
    expect(translationEngineOutput.find('EngineOutputHeader')).toHaveLength(1);
  });

  it('Missing TranslationContent', () => {
    expect(translationEngineOutput.find('TranslationContent')).toHaveLength(1);
  });
});
