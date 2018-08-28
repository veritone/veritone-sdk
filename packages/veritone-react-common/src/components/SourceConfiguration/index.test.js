import React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';
import FilePicker from 'components/FilePicker';

import SourceConfiguration from './';

const sourceTypes = {
  data: {
    records: [
      {
        name: 'Audio',
        id: 'audio1',
        sourceSchema: {
          definition: {
            properties: {
              url: {
                type: 'string'
              },
              username: {
                type: 'string',
                title: 'User Name'
              },
              password: {
                type: 'string'
              }
            },
            required: ['url', 'username', 'password']
          }
        }
      },
      {
        name: 'Audio2',
        id: 'audio_2',
        sourceSchema: {
          definition: {
            properties: {
              url: {
                type: 'string'
              },
              username: {
                type: 'string',
                title: 'User Name 2'
              },
              password: {
                type: 'string'
              },
              days: {
                type: 'number'
              }
            },
            required: ['url', 'days']
          }
        }
      }
    ]
  }
};

describe('Source Configuration', function() {
  const sourceRecords = sourceTypes.data.records;
  const { properties } = sourceRecords[0].sourceSchema.definition;
  const initialSource = {
    sourceTypeId: sourceRecords[0].id,
    name: '',
    thumbnailUrl: '',
    details: Object.keys(properties).reduce((detailObj, prop) => {
      detailObj[prop] = 'Test Value';
      return detailObj;
    }, {}),
    thumbnailFile: null
  };

  describe('SchemaDrivenSelectForm', () => {
    it("render's fields for a source schema", () => {
      const wrapper = mount(
        <SourceConfiguration
          sourceTypes={sourceRecords}
          source={initialSource}
          onInputChange={noop}
        />
      );

      Object.keys(properties).forEach(prop => {
        expect(wrapper.find(`input#${prop}`)).toHaveLength(1);
      });
    });
    it("render's fields on source change", () => {
      const testProps =
        sourceRecords[sourceRecords.length - 1].sourceSchema.definition
          .properties;
      const wrapper = mount(
        <SourceConfiguration
          sourceTypes={sourceRecords}
          source={initialSource}
          onInputChange={noop}
        />
      );

      wrapper.setProps({
        source: {
          sourceTypeId: sourceRecords[sourceRecords.length - 1].id,
          name: sourceRecords[sourceRecords.length - 1].name,
          thumbnailUrl: '',
          thumbnailFile: null,
          details: Object.keys(testProps).reduce((detailObj, prop) => {
            detailObj[prop] = '';
            return detailObj;
          }, {})
        }
      });

      wrapper.update();

      Object.keys(testProps).forEach((prop, idx) => {
        expect(wrapper.find(`input#${prop}`)).toHaveLength(1);
      });
    });
  });

  describe('FilePicker', () => {
    it('opens FilePicker component', () => {
      const wrapper = mount(
        <SourceConfiguration
          sourceTypes={sourceRecords}
          source={initialSource}
          onInputChange={noop}
        />
      );

      expect(wrapper.find(FilePicker)).toHaveLength(0);
      wrapper.find('#openFilePicker').simulate('click');
      expect(wrapper.find(FilePicker)).toHaveLength(1);
    });
  });
});
