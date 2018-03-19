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
                      iconClass: 'icon-transcription',
                      engines: [{
                          id: 'transcript1',
                          name: 'Transcript 1'
                        },{
                          id: 'transcript2',
                          name: 'Transcript 2'
                        },{
                          id: 'transcript3',
                          name: 'Transcript 3'
                        }],
                      editable: true,
                      status: 'completed',
                      categoryType: 'transcript'
                    },
                    {
                      id: '6faad6b7-0837-45f9-b161-2f6bf31b7a07',
                      name: 'Facial Detection',
                      iconClass: 'icon-face',
                      engines: [],
                      editable: false,
                      status: 'failed',
                      categoryType: 'face'
                    },
                    {
                      id: '088a31be-9bd6-4628-a6f0-e4004e362ea0',
                      name: 'Object Detection',
                      iconClass: 'icon-engine-object-detection',
                      engines: [{
                          id: 'object1',
                          name: 'Object Detection 1'
                        },{
                          id: 'object2',
                          name: 'Object Detection 2'
                        },{
                          id: 'object3',
                          name: 'Object Detection 3'
                        },{
                          id: 'object4',
                          name: 'Object Detection 4'
                        },{
                          id: 'object5',
                          name: 'Object Detection 5'
                        }],
                      editable: false,
                      status: 'inprogres',
                      categoryType: 'object'
                    }
                  ]}
                  tdo={{
                    id: 1234567,
                    startDateTime: '2018-02-02T23:24:18.000Z',
                    stopDateTime: '2018-02-02T23:25:43.000Z',
                    details: {
                      date: '2018-02-02T23:24:18.066Z',
                      source: {
                        ingestionType: 'upload'
                      },
                      veritoneFile: {
                        size: 16236167,
                        filename: 'REPORTER_GETS_A_BIG_SURPRISE.mp4',
                        mimetype: 'video/mp4'
                      },
                      veritoneProgram: {
                        programId: '-1',
                        programName: 'Upload',
                        programImage: '',
                        programLiveImage: 'https://inspirent.s3.amazonaws.com/assets/52108807/d2d6a1b5-4e00-4639-a1ac-6ef7684710a4.jpeg'
                      },
                      veritonePermissions: {
                        acls: [
                          {
                            groupId: '20aa5b42-9c31-4b1e-b5f6-acfecb23d354',
                            permission: 'owner'
                          }
                        ],
                        isPublic: false
                      },
                      tags: ['Hakuna', 'Matata', 'that\'s a wonderful phrase']
                    }
                  }} />
  ));
