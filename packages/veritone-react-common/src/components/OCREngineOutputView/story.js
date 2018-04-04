import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import styles from './story.styles.scss';

import OCREngineOutputView from './';

storiesOf('OCREngineOutputView', module).add('Base', () => {
  return (
    <OCREngineOutputView
      data={ocrAssets}
      className={styles.outputViewRoot}
      engines={engines}
      selectedEngineId="9a6ac62d-a881-8884-6ee0-f15ab84fcbe2"
      onEngineChange={action('onEngineChange')}
      onExpandClicked={action('onExpandClicked')}
      onOcrClicked={action('onOcrClicked')}
    />
  );
});

let ocrAssets = [
  {
    series: [
      {
        stopTimeMs: 1000,
        startTimeMs: 0,
        object: {
          text:
            'WITH \n DEVELOPING NOW \n TED CRUZ GAINING IN POLLS AND FUND-RAISING CNN \n Sara Murray CNW Political Reporter \n LIVE \n NAS58.43 \n AONY ON CHAMPS-ELYSEES, MAYOR SAYS \n U.S. TIGHTENING SECURITY I SITUATION ROOM \n '
        }
      },
      {
        stopTimeMs: 2000,
        startTimeMs: 1000,
        object: {
          text:
            'WITH \n DEVELOPING NOW \n TED CRUZ GAINING IN POLLS AND FUND-RAISING CNN \n Sara Murray CNW Political Reporter \n LIVE \n NAS -58.43 \n IONY ON CHAMPS-ELYSEES, MAYOR SAYS \n U.S. TIGHTENING SECURITY It SITUATION ROOM \n '
        }
      },
      {
        stopTimeMs: 3000,
        startTimeMs: 2000,
        object: {
          text:
            'WITH \n DEVELOPING NOW \n TED CRUZ GAINING IN POLLS AND FUND-RAISINGN \n Sara Murray CNW Political Reporter \n LIVE \n NAS58.43 \n I CHAMPS-ELYSEES, MAYOR SAYS \n U.S. TIGHTENING SECURITY IN HIGH-F sTUATION ROOM \n '
        }
      },
      {
        stopTimeMs: 4000,
        startTimeMs: 3000,
        object: {
          text:
            'THE WITH \n DEVELOPING NOW \n TED CRUZ GAINING IN POLLS AND FUND-RAISING CNN \n Sara Murray CW Political Reporter \n LIVE \n NAS58.43 \n ELYSEES, MAYOR SAYS \n U.S. TIGHTENING SECURTY IN HIGH-PROFILE L SITUATION ROOM \n '
        }
      },
      {
        stopTimeMs: 5000,
        startTimeMs: 4000,
        object: {
          text:
            'THE WITH \n DEVELOPING NOW \n LIVE \n TED CRUZ GAINING IN POLLS AND FUND-RAISING CNN \n Sara Murray \n MAYOR SAYS \n CNW Political Reporter \n NASS8.43 \n U.S. TIGHTENING SECURITY IN HIGH-PROFILE LOCATIONS SITUATION ROOM \n '
        }
      }
    ]
  }
];

let engines = [
  {
    id: '9a6ac62d-a881-8884-6ee0-f15ab84fcbe2',
    name: 'Cortex'
  }
];
