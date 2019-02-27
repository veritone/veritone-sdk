import React from 'react';
import { storiesOf } from '@storybook/react';
import ContainerDimensions from 'react-container-dimensions';

import PDFViewer from 'components/PDFViewer';
import testPDF from './test.pdf';

storiesOf('PDFViewer', module).add('Static PDF', () => (
  <PDFViewer height={600} width={600} file={testPDF} />
));

storiesOf('PDFViewer', module).add('Responsive PDF', () => (
  <div style={{ width: '100%', maxWidth: '500px', height: '600px' }}>
    <ContainerDimensions>
      {({ width, height }) => {
        return <PDFViewer height={height} width={width} file={testPDF} />;
      }}
    </ContainerDimensions>
  </div>
));
