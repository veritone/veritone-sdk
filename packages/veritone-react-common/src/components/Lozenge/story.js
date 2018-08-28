import React from 'react';
import { storiesOf } from '@storybook/react';

import Lozenge from './';

storiesOf('Lozenge', module)
  .add('Base', () => {
    return <Lozenge>Foo</Lozenge>;
  })
  .add('With Custom Background Colors', () => {
    return (
      <div>
        <div style={{ marginBottom: '10px' }}>
          <Lozenge backgroundColor="#E91E63">foo</Lozenge>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <Lozenge backgroundColor="#009688">bar</Lozenge>
        </div>
        <div>
          <Lozenge backgroundColor="red">baz</Lozenge>
        </div>
      </div>
    );
  })
  .add('With Custom Text Colors', () => {
    return (
      <div>
        <div style={{ marginBottom: '10px' }}>
          <Lozenge backgroundColor="lightgrey" textColor="#E91E63">
            foo
          </Lozenge>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <Lozenge backgroundColor="lightgrey" textColor="#009688">
            bar
          </Lozenge>
        </div>
        <div>
          <Lozenge backgroundColor="lightgrey" textColor="red">
            baz
          </Lozenge>
        </div>
      </div>
    );
  })
  .add('With Icons', () => {
    return (
      <div>
        <div style={{ marginBottom: '10px' }}>
          <Lozenge iconClassName="icon-gps">foo</Lozenge>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <Lozenge iconClassName="icon-face">bar</Lozenge>
        </div>
        <div>
          <Lozenge iconClassName="icon-ocr">baz</Lozenge>
        </div>
      </div>
    );
  });
