import React from 'react';
import { storiesOf } from '@storybook/react';
import { number } from 'prop-types';

import PDFViewer from 'components/PDFViewer';
import testPDF from './test.pdf';
import styles from './styles.scss';

const Header = ({ currentPage, numPages }) => (
  <div className={styles.pdfHeader}>
    Page {currentPage} of {numPages}
  </div>
);
Header.propTypes = {
  currentPage: number,
  numPages: number
};

storiesOf('PDFViewer', module).add('Basic', () => (
  <div style={{ width: '100%', maxWidth: '500px', height: '600px' }}>
    <PDFViewer file={testPDF} />;
  </div>
));

storiesOf('PDFViewer', module).add('With Header', () => <Story />);

class Story extends React.Component {
  state = {
    currentPage: null,
    numPages: null
  };

  handleItemsRendered = ({ currentPage, numPages }) => {
    if (currentPage !== this.state.currentPage) {
      this.setState({ currentPage, numPages });
    }
  };

  render() {
    const { currentPage, numPages } = this.state;
    return (
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          height: '600px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Header currentPage={currentPage} numPages={numPages} />
        <div style={{ flex: 1 }}>
          <PDFViewer
            file={testPDF}
            onItemsRendered={this.handleItemsRendered}
          />
        </div>
      </div>
    );
  }
}
