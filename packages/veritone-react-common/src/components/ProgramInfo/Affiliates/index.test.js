import React from 'react';
import { mount } from 'enzyme';
import { cloneDeep } from 'lodash';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import { combineReducers, createStore  } from 'redux';
import EditAffiliateDialog from './EditAffiliateDialog/index';
import AffiliateStationsDialog from './AffiliateStationsDialog/index';
import BulkAddAffiliatesDialog from './BulkAddAffiliatesDialog/index';
import { generateAffiliateById } from './test-helpers';
import Affiliates from './index';

describe('Affiliates', () => {
  const store = createStore(
    combineReducers({
      form: formReducer
    })
  );
  const onAffiliatesChange = jest.fn();
  const loadNextAffiliates = jest.fn();
  const loadAllAffiliates = jest.fn();

  it('should render affiliates', () => {
    const wrapper = mount(
      <Affiliates
        loadNextAffiliates={loadNextAffiliates}
        selectedAffiliateById={generateAffiliateById(11, true)}
        onAffiliatesChange={onAffiliatesChange}
        canBulkAddAffiliates
      />
    );
    expect(wrapper.find('.titleLabel').text()).toEqual('Affiliated Stations');
    expect(wrapper.find('.titleDescription').text()).toEqual('Assign affiliated stations that also broadcast programming from this ingestion source.');
    expect(wrapper.find('.affiliateItem')).toHaveLength(11);
    expect(wrapper.find('.addAffiliateActionButtons').find('button')).toHaveLength(2);
    expect(wrapper.find('.addAffiliateActionButtons').find('button').at(0).text()).toEqual('ADD AFFILIATE');
    expect(wrapper.find('.addAffiliateActionButtons').find('button').at(1).text()).toEqual('BULK ADD AFFILIATES');

    const affiliateItem = wrapper.find('.affiliateItem').first();
    expect(affiliateItem).toBeDefined();
    expect(affiliateItem.find('.title').find('.name').text()).toEqual('Affiliate Station 1');
    expect(affiliateItem.find('.title').find('IconButton')).toHaveLength(2);
    expect(affiliateItem.find('.schedule').text()).toEqual('W 16:33-17:21; T 12:33-03:21 01:00-01:00');
  });

  it('should remove affiliate on delete icon click', () => {
    const selectedAffiliates = generateAffiliateById(11, true);
    const wrapper = mount(
      <Affiliates
        loadNextAffiliates={loadNextAffiliates}
        selectedAffiliateById={selectedAffiliates}
        onAffiliatesChange={onAffiliatesChange}
      />
    );
    wrapper
      .find('.affiliateItem')
      .first()
      .find('.title')
      .find('IconButton')
      .first()
      .simulate('click');

    const deletedAffiliateId = Object.keys(selectedAffiliates)[0];
    const expectedAffiliates = cloneDeep(selectedAffiliates);
    delete expectedAffiliates[deletedAffiliateId];
    expect(onAffiliatesChange).toHaveBeenCalledWith(expectedAffiliates);
  });

  it('should open edit affiliate dialog', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Affiliates
          loadNextAffiliates={loadNextAffiliates}
          selectedAffiliateById={generateAffiliateById(11, true)}
          onAffiliatesChange={onAffiliatesChange}
        />
      </Provider>
    );
    wrapper
      .find('.affiliateItem')
      .first()
      .find('.title')
      .find('IconButton')
      .at(1)
      .simulate('click');
    const editAffiliateDialogElement = wrapper.find(EditAffiliateDialog);
    expect(editAffiliateDialogElement).toHaveLength(1);
    expect(editAffiliateDialogElement.find('.dialogTitle').text()).toEqual('Affiliate Station 1');
  });

  it('should open affiliated stations dialog', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Affiliates
          loadNextAffiliates={loadNextAffiliates}
          onAffiliatesChange={onAffiliatesChange}
        />
      </Provider>
    );
    wrapper
      .find('.addAffiliateActionButtons')
      .find('button')
      .at(0)
      .simulate('click');
    const affiliateStationsDialogElement = wrapper.find(AffiliateStationsDialog);
    expect(affiliateStationsDialogElement).toHaveLength(1);
    expect(affiliateStationsDialogElement.find('.dialogTitle').text()).toEqual('Affiliated Stations');
    expect(loadNextAffiliates).toHaveBeenCalled();
  });

  it('should not render bulk add affiliate button', () => {
    const wrapper = mount(
      <Affiliates
        loadNextAffiliates={loadNextAffiliates}
        selectedAffiliateById={generateAffiliateById(11, true)}
        onAffiliatesChange={onAffiliatesChange}
      />
    );
    expect(wrapper.find('.addAffiliateActionButtons').find('button')).toHaveLength(1);
    expect(wrapper.find('.addAffiliateActionButtons').find('button').at(0).text()).toEqual('ADD AFFILIATE');
  });

  it('should open bulk add affiliate dialog', () => {

    const wrapper = mount(
      <Provider store={store}>
        <Affiliates
          loadAllAffiliates={loadAllAffiliates}
          onAffiliatesChange={onAffiliatesChange}
          canBulkAddAffiliates
        />
      </Provider>
    );
    wrapper
      .find('.addAffiliateActionButtons')
      .find('button')
      .at(1)
      .simulate('click');
    const bulkAddAffiliatesDialogElement = wrapper.find(BulkAddAffiliatesDialog);
    expect(bulkAddAffiliatesDialogElement).toHaveLength(1);
    expect(bulkAddAffiliatesDialogElement.find('.dialogTitle').text()).toEqual('Bulk Add Affiliates');
  });
});
