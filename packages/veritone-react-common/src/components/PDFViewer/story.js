import React from 'react';
import { storiesOf } from '@storybook/react';
import { number } from 'prop-types';

import { PDFViewer, SimplePDFViewer } from 'components/PDFViewer';
import testPDF from './test.pdf';
import styles from './story.styles.scss';

storiesOf('PDFViewer', module).add('Simple PDF Viewer', () => (
  <div style={{ width: '100%', maxWidth: '500px', height: '600px' }}>
    <SimplePDFViewer file={testPDF} initialPageOffset={4} />
  </div>
));

storiesOf('PDFViewer', module).add('Fancy PDF Viewer', () => (
  <div style={{ width: '100%', height: '800px' }}>
    <PDFViewer file={testPDF} className={styles.fancyPDFViewer} />
  </div>
));

storiesOf('PDFViewer', module).add(
  'Fancy PDF Viewer With Initial Page Offset',
  () => (
    <div style={{ width: '100%', height: '800px' }}>
      <PDFViewer
        file={testPDF}
        className={styles.fancyPDFViewer}
        initialPageOffset={4}
        initialSearchText={'test'}
      />
    </div>
  )
);
