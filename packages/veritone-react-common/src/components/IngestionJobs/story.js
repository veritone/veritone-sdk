import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

// import IngestionJobFullScreen from './IngestionJobFullScreen';
import IngestionJobTileView from './IngestionJobTileView';
import IngestionJobGridCard from './IngestionJobGridView/IngestionJobGridCard';
import IngestionJobGridView from './IngestionJobGridView';
import IngestionJobNullstate from './Nullstate';


// TODO: new data needed
var jobInfo = {
  data: {
    scheduledJobs: {
      records: [
        {
          id: "35874",
          name: "test job",
          isActive: true,
          jobTemplates: {
            records: [
              {
                id: "jobtemplateguid",
                
              }
            ]
          }
        }
      ]
    }
  }
}


storiesOf('IngestionJobs', module)
  // .add('FullScreen', () => (
  //   <IngestionJobFullScreen data={data} sdoSchemaInfo={sdoSchemaInfo} jobInfo={oneJobInfo} />
  // ))
  .add('Tile View', () => (
    <IngestionJobTileView jobInfo={{}}/>
  ))
  // .add('Grid Card', () => (
  //   <IngestionJobGridCard checkedAll={false} jobName={jobInfo[0].name} status={jobInfo[0].status} creationDate={jobInfo[0].creationDate} thumbnail={jobInfo[0].thumbnail} />
  // ))
  // .add('Grid View', () => (
  //   <IngestionJobGridView jobInfo={jobInfo}/>
  // ))
  .add('NullState', () => (
    <IngestionJobNullstate />
  ))