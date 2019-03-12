import React from 'react';
import { storiesOf } from '@storybook/react';
import { number } from 'prop-types';

import { PDFViewer, SimplePDFViewer } from 'components/PDFViewer';
import testPDF from './test.pdf';
import styles from './story.styles.scss';

storiesOf('PDFViewer', module).add('Simple PDF Viewer', () => (
  <div style={{ width: '100%', maxWidth: '600px', height: '600px' }}>
    <SimplePDFViewer file={testPDF} />
  </div>
));

storiesOf('PDFViewer', module).add('Fancy PDF Viewer', () => (
  <div style={{ height: '80vh', width: '50vw' }}>
    <PDFViewer file={testPDF} />
  </div>
));

storiesOf('PDFViewer', module).add(
  'Fancy PDF Viewer With Initial Page Offset',
  () => (
    <div style={{ height: '90vh', width: '50vw' }}>
      <PDFViewer
        file={testPDF}
        className={styles.fancyPDFViewer}
        initialPageOffset={3}
        initialSearchText={'quiso'}
      />
    </div>
  )
);
