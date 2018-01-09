import React from 'react';
import { string, node } from 'prop-types';

import LibCheckbox from 'material-ui/Checkbox';
// import LibCheckbox from './Checkbox';

import cjisLogo from './images/CJIS_logo.png';
import fedrampLogo from './images/fedramp_logo.png';
import networkIsolatedLogo from './images/networkisolated_logo.png';

import { Lozenge, Price, Ellipsis } from 'veritone-react-common';

import StarRating from './StarRating';
import AddedButton from './AddedButton';

import styles from './styles.scss';

export default class EngineSelectionRow extends React.Component {
  static propTypes = {
  };

  onCheck() {
    console.log('EngineSelectionRow Checkbox()')
  }

  render() {
    // const { } = this.props;
    return (
      <div className={styles.engineSelectionRow}>
        <div className={styles.avatar}>
          <img src="http://www.crimsy.com/images/100x100.PNG" />
          <div className={styles.engineSelect}>
            <LibCheckbox onCheck={this.onCheck} />
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.main}>
              <div className={styles.headings}>
                <div className={styles.title}>Sample Title</div>
                <div className={styles.subTitle}>Sample Sub Title</div>
              </div>
              <Price />
            </div>
            <div className={styles.info}>
              {<Lozenge type="transcription" />}
              {/* <StarRating /> */}
            </div>
            <div className={styles.description}>
              Augue copiosae postulant vix ea, vel quot mucius maluisset ut, ad duo debet suavitate periculis. Impedit scribentur ex sed, qui illum mazim consectetuer ei, his mundi legere vivendum ex.
              {/* <Ellipsis /> */}
            </div>
          </div>
          <div className={styles.select}>
            <div className={styles.logos}>
              <div className={styles.logo}>
                <img src={cjisLogo} />
              </div>
              <div className={styles.logo}>
                <img src={fedrampLogo} />
              </div>
              <div className={styles.logo}>
                <img src={networkIsolatedLogo} />
              </div>
            </div>
            <div className={styles.button}>
              <AddedButton />
            </div>
          </div>
        </div>
      </div>
    );
  }
}