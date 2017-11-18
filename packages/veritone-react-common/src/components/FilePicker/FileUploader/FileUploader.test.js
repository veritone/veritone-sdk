import React, { Component } from 'react';
import TestBackend from 'react-dnd-test-backend';
import { DragDropContext } from 'react-dnd';
import TestUtils from 'react-dom/test-utils';
import { mount, shallow } from 'enzyme';
import FileUploader from './FileUploader';

function wrapInTestContext(DecoratedComponent) {
    return DragDropContext(TestBackend)(
        class TestContextContainer extends Component {
            render() {
                return <DecoratedComponent {...this.props} />;
            }
        }
    );
}

describe('FileUploader', () => {
    it('should render', () => {
        // TODO: Implement some tests for this
    });
})