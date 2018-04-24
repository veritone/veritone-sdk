import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { number } from '@storybook/addon-knobs/react';

import FingerprintEngineOutput from './';

storiesOf('FingerprintEngineOutput', module).add('Base', () => {
  const libraries = genLibraries(5);
  const entities = genEntities(10, libraries);
  const mockData = genMockData(0, 600000, 1000, entities);

  return (
    <FingerprintEngineOutput
      data={mockData}
      entities={entities}
      libraries={libraries}
      onClick={action('on click')}
      mediaPlayerTimeMs={1000 * number('player time', 0)}
      mediaPlayerTimeIntervalMs={1000}
      selectedEngineId={selectedEngineId}
      engines={engines}
      onEngineChange={action('engine select')}
      onExpandClicked={action('expand view clicked')}
    />
  );
});

const selectedEngineId = '1';
const engines = [
  { id: '1', name: 'Engine-X' },
  { id: '2', name: 'Engine-Y' },
  { id: '3', name: 'Engine-Z' }
];

// Mock Data Generator
function genMockData(startTime, stopTime, timeInterval, entities) {
  const series = [];
  const numEntries = Math.ceil((stopTime - startTime) / timeInterval);
  for (let entryIndex = 0; entryIndex < numEntries; entryIndex++) {
    const entryStartTime = startTime + entryIndex * timeInterval;
    const entryStopTime = entryStartTime + timeInterval;
    const randomEntityIndex = getRandomIndex(entities);
    series.push({
      startTimeMs: entryStartTime,
      stopTimeMs: entryStopTime,
      object: {
        entityId: entities[randomEntityIndex].entityId,
        confidence: Math.round(Math.random() * 100) / 100
      }
    });
  }

  return [
    {
      startTimeMs: startTime,
      stopTimeMs: stopTime,
      status: 'success',
      series: series
    }
  ];
}

function genEntities(numEntities, libraries) {
  const entityNames = [
    'veritone',
    'beat',
    'Snowy Parrot',
    'Summer Whale',
    'Kissing Rhinoceros',
    'Arcane Dolphin',
    'Disney',
    'Bruce Man'
  ];

  const logoImages = [
    'https://radioink.com/wp-content/uploads/sites/2/2017/04/Veritone-stacked-logo-300x300.jpg',
    'https://www.seoclerk.com/pics/558390-11FO8A1505384509.png',
    'https://cdn.shopify.com/s/files/1/0060/7512/products/etiqueta_pegatina_craft_manualidades_corazon_rojo_1024x1024.jpg?v=1497876647',
    'https://t3.ftcdn.net/jpg/00/83/03/34/500_F_83033454_a03t6cMxLlZQWnoPlE4N1gLRas6sm7oD.jpg',
    'https://i.pinimg.com/originals/26/30/15/2630152deefdd040dc1e790b5528b34b.jpg',
    'https://image.freepik.com/free-vector/abstract-logo-with-colorful-leaves_1025-695.jpg',
    'https://cdn.designcrowd.com/blog/2016/January/top-company-logos-black/2_Disney_400.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7aBqO81rIJBweMSi2x8bFAaipQjum6mxrphPY9eXmJuIPxbDXUg'
  ];

  const entities = [];
  for (let index = 0; index < numEntities; index++) {
    const randomNameIndex = getRandomIndex(entityNames);
    const randomName = entityNames[randomNameIndex];
    const randomLogo = logoImages[randomNameIndex];
    const randomLibIndex = getRandomIndex(libraries);
    entities.push({
      name: randomName + '-' + index,
      profileImageUrl: randomLogo,
      description: 'description...',
      entityId: 'entity-' + index,
      libraryId: libraries[randomLibIndex].libraryId,
      jsondata: {
        advertiser: 'bla bla bla',
        spotType: 'voice',
        duration: '10:00',
        iSCI: '234'
      }
    });
  }

  return entities;
}

function genLibraries(numLibs) {
  const libNames = [
    'Dracaena barbus',
    'Rhincodon pygmaeus',
    'Pterois rupicapra',
    'Bubalus acutorostrata',
    'Caridea rosalia',
    'Sagaurus derbinus',
    'Vivona latricha',
    'Capruarius mandtus'
  ];

  const libs = [];
  if (numLibs < libNames.length) {
    for (let index = 0; index < numLibs; index++) {
      const randomNameIndex = getRandomIndex(libNames);
      const randomName = libNames.splice(randomNameIndex, 1)[0];
      libs.push({
        name: randomName,
        libraryId: 'lib-' + index,
        description: 'Lib Description Goes Here'
      });
    }
  }

  return libs;
}

function getRandomIndex(source) {
  if (source && source.length > 0) {
    return Math.round(Math.random() * (source.length - 1));
  } else {
    return -1;
  }
}
