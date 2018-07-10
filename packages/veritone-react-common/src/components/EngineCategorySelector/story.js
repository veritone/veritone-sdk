import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import EngineCategorySelector from './';

storiesOf('EngineCategorySelector', module).add('Base', () => {
  const TRANSCRIPT_ENGINE_CATEGORY = {
    id: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
    name: 'Transcription',
    iconClass: 'icon-transcription',
    engines: [],
    editable: true,
    status: 'completed',
    categoryType: 'transcript'
  };
  const FACE_ENGINE_CATEGORY = {
    id: '6faad6b7-0837-45f9-b161-2f6bf31b7a07',
    name: 'Facial Detection',
    iconClass: 'icon-face',
    engines: [],
    editable: true,
    status: 'failed',
    categoryType: 'face'
  };
  const engineCategories = [TRANSCRIPT_ENGINE_CATEGORY, FACE_ENGINE_CATEGORY];

  return (
    <EngineCategorySelector
      engineCategories={engineCategories}
      selectedEngineCategoryId={engineCategories[0].id}
      onSelectEngineCategory={action('onSelectEngineCategory')}
    />
  );
});
