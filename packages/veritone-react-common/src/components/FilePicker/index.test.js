import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import Dialog from 'material-ui/Dialog';

import FilePicker from './';
import FileUploader from './FileUploader/FileUploader';

describe('FilePicker', () => {
    it('should render', () => {
        // TODO: implement file picker test.
        // I believe the Dialog library uses react portals which aren't supported by
        // enzyme and the momment according to this
        // https://github.com/airbnb/enzyme/blob/master/docs/common-issues.md
        // will look into other ways of testing.
    })
})