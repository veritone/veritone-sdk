import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

// import IngestionJobFullScreen from './IngestionJobFullScreen';
import IngestionJobTileView from './IngestionJobTileView';
import IngestionJobGridCard from './IngestionJobGridView/IngestionJobGridCard';
import IngestionJobGridView from './IngestionJobGridView';
import IngestionJobNullstate from './Nullstate';


// TODO: new data needed


storiesOf('IngestionJobs', module)
  // .add('FullScreen', () => (
  //   <IngestionJobFullScreen data={data} sdoSchemaInfo={sdoSchemaInfo} jobInfo={oneJobInfo} />
  // ))
  .add('Tile View', () => (
    <IngestionJobTileView jobInfo={jobInfo}/>
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