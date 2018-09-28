import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import { combineReducers, createStore } from 'redux';
import { generateAffiliateById, loadNextAffiliates } from './test-helpers';

import Affiliates from './';

const store = createStore(
  combineReducers({
    form: formReducer
  })
);

storiesOf('Program Affiliates', module)
  .add('Base', () => (
    <Provider store={store}>
      <Affiliates
        loadNextAffiliates={loadNextAffiliates}
        affiliateById={generateAffiliateById(11, true)}
        onAffiliatesChange={action('onAffiliatesChange')}
        canBulkAddAffiliates
      />
    </Provider>
  ))
  .add('No Initial Affiliates', () => (
    <Provider store={store}>
      <Affiliates
        loadNextAffiliates={loadNextAffiliates}
        onAffiliatesChange={action('onAffiliatesChange')}
        canBulkAddAffiliates
      />
    </Provider>
  ));
