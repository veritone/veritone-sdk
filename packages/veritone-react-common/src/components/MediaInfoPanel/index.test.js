import React from 'react';
import { mount } from 'enzyme';
import MediaInfoPanel from './';

const TDO = {
  id: '400003025',
  details: {
    tags: [
      { value: 'tag1' }, { value: 'longer tag' }, { value: 'a bit longer tag' },
      { value: 'very very very very very very very very very very very very very very long tag' },
      { value: 'tag 3' }, { value: 'tag 4' }, { value: 'tag 5' }, { value: 'tag 6' },
      { value: 'tag 7' }, { value: 'tag 8' }, { value: 'tag 9' }, { value: 'tag 0' },
      { value: 'hakuna' }, { value: 'matata' }
    ],
    veritoneFile: {
      filename: '2FOTUlhqRaQYqjrCLcahix_mikeandmike2FOTUlhqRaQYqjrCLcahix_mikeandmike2FOTUlhqRaQYqjrCLcahix_mikeandmike2FOTUlhqRaQYqjrCLcahix_mikeandmike.mp4'
    },
    date: '2018-01-18T00:09:06.685Z',
    veritoneProgram: {
      programId: '-1',
      programName: 'Upload',
      programImage: '',
      programLiveImage: 'https://s3.amazonaws.com/dev.inspirent/assets/400003025/4d498250-636a-4b69-8e0b-ab2d8cb6ceab.jpeg',
      signedProgramLiveImage: 'https://s3.amazonaws.com/dev.inspirent/assets/400003025/4d498250-636a-4b69-8e0b-ab2d8cb6ceab.jpeg'
    },
    source: { ingestionType: 'upload' },
    veritonePermissions: {
      acls: [ { groupId: 'ea738f5b-9f52-45f3-8db8-3167bfd625fe', permission: 'owner' } ],
      isPublic: false
    },
    veritoneCustom: { source: 'Los Angeles' },
    veritoneCreative: {}
  },
  startDateTime: '2018-01-20T00:44:21.402Z',
  stopDateTime: '2018-01-20T00:44:41.403Z',
  applicationId: 'ed075985-bc94-406b-8639-44d1da42c3fb',
  security: {
    global: true
  },
  thumbnailUrl: 'https://s3.amazonaws.com/dev.inspirent/assets/400003025/4d498250-636a-4b69-8e0b-ab2d8cb6ceab.jpeg',
  sourceImageUrl: null,
  primaryAsset: {
    id: '9926cdef-f848-4cbb-a1d5-de0b0ff035dd',
    signedUri: 'https://s3.amazonaws.com/dev.inspirent/assets/400003025/7bab3e8f-53ea-473c-bb96-8bc07d31264e.mp4'
  },
  streams:[]
};

const ENGINE_CATEGORIES = [{
  name: 'Fingerprint',
  id: '17d62b84-8b49-465b-a6be-fe3ea3bc8f05',
  engines: [ { id: 'fingerprint-audio', name: 'Mars' } ]
}, {
  name: 'Transcription',
  id: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
  engines: [ { id: 'transcribe-voicebase', name: 'Temporal' }, { id: 'transcribe-voicebase-benchmark', name: 'VoiceBase-Benchmark' } ]
}];

const CONTEXT_MENU_EXTENTIONS = {
  tdos: [{
    id: '400003025',
    label: 'TDO on CMS dev',
    url: 'https://cms.aws-dev.veritone.com/#/media-details/400003025'
  }]
};

const KVP = {
  features: {
    downloadMedia: 'enabled',
    downloadPublicMedia: 'enabled'
  },
  applicationIds: ['ed075985-bc94-406b-8639-44d1da42c3fb']
};

describe('MediaInfoPanel', () => {
  it('should show media info panel', () => {
    const onClose = jest.fn();

    const wrapper = mount(
      <MediaInfoPanel
        tdo={TDO}
        engineCategories={ENGINE_CATEGORIES}
        kvp={KVP}
        contextMenuExtensions={CONTEXT_MENU_EXTENTIONS}
        onClose={onClose}
        onSaveMetadata={jest.fn()} />);

    expect(wrapper.find('.infoPanelHeader').exists()).toEqual(true);
    expect(wrapper.find('.infoPanelHeader').text()).toEqual('Metadata');

    const infoFields = wrapper.find('.infoField');
    expect(infoFields.length).toEqual(5);
    expect(infoFields.at(0).find('.infoFieldLabel').text()).toEqual('Filename');
    expect(infoFields.at(0).find('.infoFieldData').text()).toEqual(TDO.details.veritoneFile.filename);
    expect(infoFields.at(1).find('.infoFieldLabel').text()).toEqual('Date Created');
    expect(infoFields.at(1).find('.infoFieldData').text()).toContain('Wed');
    expect(infoFields.at(1).find('.infoFieldData').text()).toContain('17');
    expect(infoFields.at(1).find('.infoFieldData').text()).toContain('2018');
    expect(infoFields.at(2).find('.infoFieldLabel').text()).toEqual('Duration');
    expect(infoFields.at(2).find('.infoFieldData').text()).toEqual('00:00:20');
    expect(infoFields.at(3).find('.infoFieldLabel').text()).toEqual('Engines');
    expect(infoFields.at(3).find('.infoFieldData').text()).toEqual('Fingerprint: MarsTranscription: Temporal, VoiceBase-Benchmark');
    expect(infoFields.at(4).find('.infoFieldLabel').text()).toEqual('Tags');
    expect(infoFields.at(4).find('.infoFieldData').text()).toEqual('tag1, longer tag, a bit longer tag, very very very very very very very very very very very very very very long tag, tag 3, tag 4, tag 5, tag 6, tag 7, tag 8, tag 9, tag 0, hakuna, matata');

    expect(wrapper.find('.programLiveImage').prop('src')).toEqual(TDO.thumbnailUrl);
    expect(wrapper.find('.programImage').prop('src')).toEqual('//static.veritone.com/veritone-ui/program_image_null.svg');


    expect(wrapper.find('.infoPanelHeader').find('[aria-label="More"]').exists()).toEqual(true);
    wrapper.find('.infoPanelHeader').find('[aria-label="More"]').first().simulate('click');
    expect(wrapper.find('#menu-list-grow').exists()).toEqual(true);
    const moreMenuItems = wrapper.find('#menu-list-grow').find('li');
    expect(moreMenuItems.length).toEqual(4);
    expect(moreMenuItems.at(0).text()).toEqual('Edit Metadata');
    expect(moreMenuItems.at(1).text()).toEqual('Edit Tags');
    expect(moreMenuItems.at(2).text()).toEqual('Download');
    expect(moreMenuItems.at(3).text()).toEqual('TDO on CMS dev');

    const closeButton = wrapper
      .find('.infoPanelHeader')
      .find('.headerMenu')
      .find('.closeButton')
      .first();
    closeButton.simulate('click');
    expect(onClose).toHaveBeenCalled();
  });

  it('should not show context menu extensions', () => {
    const wrapper = mount(
      <MediaInfoPanel
        tdo={TDO}
        engineCategories={ENGINE_CATEGORIES}
        kvp={KVP}
        onClose={jest.fn()}
        onSaveMetadata={jest.fn()} />);
    expect(wrapper.find('.infoPanelHeader').find('[aria-label="More"]').exists()).toEqual(true);
    wrapper.find('.infoPanelHeader').find('[aria-label="More"]').first().simulate('click');
    expect(wrapper.find('#menu-list-grow').exists()).toEqual(true);
    const moreMenuItems = wrapper.find('#menu-list-grow').find('li');
    expect(moreMenuItems.length).toEqual(3);
  });
});
