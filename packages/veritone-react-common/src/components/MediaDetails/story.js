import React from 'react';
import { storiesOf } from '@storybook/react';

import MediaDetails from './';

storiesOf('MediaDetails', module)
  .add('Initialized', () => (
    <MediaDetails mediaId={1234567}
                  onClose={() => {console.log('Media Details story onClose clicked.')}}
                  engineCategories={[
                    {
                      id: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
                      name: 'Transcription',
                      iconClass: 'icon-engine-transcription',
                      engines: [],
                      editable: true,
                      status: 'completed',
                      categoryType: 'transcript'
                    },
                    {
                      id: '6faad6b7-0837-45f9-b161-2f6bf31b7a07',
                      name: 'Facial Detection',
                      iconClass: 'icon-engine-face',
                      engines: [],
                      editable: false,
                      status: 'failed',
                      categoryType: 'face'
                    },
                    {
                      id: 'f951fbf9-aa69-47a2-87c8-12dfb51a1f18',
                      name: 'Thumbnail',
                      iconClass: 'icon-engine-transcode',
                      engines: [],
                      editable: false,
                      status: 'inprogres',
                      categoryType: 'thumbnail'
                    }
                  ]}>
    </MediaDetails>
  ));
