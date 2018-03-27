import React from 'react';
import { storiesOf } from '@storybook/react';

import styles from './story.styles.scss';
import OCREngineOutputView from './';


const ocrAssets = [
  {
    startTimeMs: 0,
    endTimeMs: 22000,
    sourceEngineId: '9a6ac62d-a881-8884-6ee0-f15ab84fcbe2',
    sourceEngineName: 'Cortex',
    taskId:
      '23969da8-c532-46ae-b4cf-b002d44b31ce-82e4453e-b1a9-425f-8b5c-488915939bac',
    series: [
      {
        end: 1000,
        start: 0,
        object: {
          text:
            'WITH \n DEVELOPING NOW \n TED CRUZ GAINING IN POLLS AND FUND-RAISING CNN \n Sara Murray CNW Political Reporter \n LIVE \n NAS58.43 \n AONY ON CHAMPS-ELYSEES, MAYOR SAYS \n U.S. TIGHTENING SECURITY I SITUATION ROOM \n '
        }
      },
      {
        end: 2000,
        start: 1000,
        object: {
          text:
            'WITH \n DEVELOPING NOW \n TED CRUZ GAINING IN POLLS AND FUND-RAISING CNN \n Sara Murray CNW Political Reporter \n LIVE \n NAS -58.43 \n IONY ON CHAMPS-ELYSEES, MAYOR SAYS \n U.S. TIGHTENING SECURITY It SITUATION ROOM \n '
        }
      },
      {
        end: 3000,
        start: 2000,
        object: {
          text:
            'WITH \n DEVELOPING NOW \n TED CRUZ GAINING IN POLLS AND FUND-RAISINGN \n Sara Murray CNW Political Reporter \n LIVE \n NAS58.43 \n I CHAMPS-ELYSEES, MAYOR SAYS \n U.S. TIGHTENING SECURITY IN HIGH-F sTUATION ROOM \n '
        }
      },
      {
        end: 4000,
        start: 3000,
        object: {
          text:
            'THE WITH \n DEVELOPING NOW \n TED CRUZ GAINING IN POLLS AND FUND-RAISING CNN \n Sara Murray CW Political Reporter \n LIVE \n NAS58.43 \n ELYSEES, MAYOR SAYS \n U.S. TIGHTENING SECURTY IN HIGH-PROFILE L SITUATION ROOM \n '
        }
      },
      {
        end: 5000,
        start: 4000,
        object: {
          text:
            'THE WITH \n DEVELOPING NOW \n LIVE \n TED CRUZ GAINING IN POLLS AND FUND-RAISING CNN \n Sara Murray \n MAYOR SAYS \n CNW Political Reporter \n NASS8.43 \n U.S. TIGHTENING SECURITY IN HIGH-PROFILE LOCATIONS SITUATION ROOM \n '
        }
      }
    ]
  }
];

storiesOf('OCREngineOutputView', module).add('Base', () => {
  return (
    <OCREngineOutputView assets={ocrAssets} className={styles.outputViewRoot} />
  );
});
