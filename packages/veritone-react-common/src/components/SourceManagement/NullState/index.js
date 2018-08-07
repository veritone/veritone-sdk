import React from 'react';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import { func } from 'prop-types';
import NullstateImage from 'images/cms-sources-null.svg';
import NullState from 'components/NullState';

import styles from './styles.scss';

@withMuiThemeProvider
export default class SourceManagementNullState extends React.Component {
  static propTypes = {
    onClick: func.isRequired
  };

  render() {
    const { onClick } = this.props;

    return (
      <NullState
        imgProps={{
          src: NullstateImage,
          alt: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
          style: {
            fontSize: '100px',
            marginBottom: '30px'
          }
        }}
        titleText="No Sources"
        btnProps={{
          onClick,
          text: 'Create a Source'
        }}
      >
        <div className={styles.greyText}>
          If you need help getting started, take a look at the
        </div>
        <div className={styles.linkText}>How to Create a Source</div>
      </NullState>
    );
  }
}
