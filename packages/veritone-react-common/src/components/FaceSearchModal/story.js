import React from 'react';
import { storiesOf } from '@storybook/react';
import { FaceSearchModal } from './';
import { FaceSearchForm } from './';

import { boolean, object } from '@storybook/addon-knobs';

storiesOf('FaceSearchModal', module).add('withOpenDialogAndDefaultValue', () => {
  const logFilter = value => console.log('filter value', value);
  const cancel = () => console.log("cancel pressed");
  const testImage = 'http://odditymall.com/includes/content/upload/hank-hill-tripping-balls-t-shirt-1020.jpg';
  const testEntity = {
    id: 'some entityId',
    type: 'entity',
    label: 'Some entity',
    image: testImage,
    description: 'dude got arrest man'
  };
  const fakeAutocompleteFunc = text => {
    return new Promise((resolve, reject) => {
      resolve([{
        header: 'Libraries',
        items: [{
          id: 'some libraryId',
          type: 'library',
          label: 'Hank Hill',
          image: 'http://odditymall.com/includes/content/upload/hank-hill-tripping-balls-t-shirt-1020.jpg',
          description: 'I tell you whut'
        }] 
      }]);
    });
  };
  return (
    <FaceSearchModal
      open={ boolean("Open", true) }
      modalState={ object( "Search condition state", { queryResults: [], selectedResults: [] } ) }
      cancel={ cancel }
      fetchAutocompleteResults={ fakeAutocompleteFunc }
      applyFilter={ logFilter }
    />
  );
}).add( 'withoutDialog', () => {
  return (
    <FaceSearchForm
      defaultValue={ [object( "Search condition state", [{ "libraryId": ('Some libraryId'), "entityId": ('Some entityId') }] )] }
    />
  );
});
