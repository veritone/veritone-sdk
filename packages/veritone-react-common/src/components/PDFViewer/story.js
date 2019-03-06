import React from 'react';
import { storiesOf } from '@storybook/react';
import { number } from 'prop-types';

import { PDFViewer, SimplePDFViewer } from 'components/PDFViewer';
import testPDF from './test.pdf';
import styles from './story.styles.scss';

storiesOf('PDFViewer', module).add('Simple PDF Viewer', () => (
  <div style={{ width: '100%', maxWidth: '500px', height: '600px' }}>
    <SimplePDFViewer file={testPDF} />
  </div>
));

storiesOf('PDFViewer', module).add('Fancy PDF Viewer', () => (
  <div style={{ width: '100%', height: '1000px' }}>
    <PDFViewer file={testPDF} className={styles.fancyPDFViewer} />
  </div>
));
