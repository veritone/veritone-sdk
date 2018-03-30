import React from 'react';

import NullstateImage from 'resources/images/cms-content-templates-null.svg';
import styles from './styles.scss';

export default class ContentTemplatesNullstate extends React.Component {
  render() {
    return (
      <div className={styles.nullStateView}>
        {/* <Icon className={'icon-translation'} style={{fontSize: '100px'}}></Icon> USE THIS ICON FOR NOW SINCE IT LOOKS MOST SIMILAR TO DATASETS ICON  */}
        <img
          style={{ fontSize: '80px', marginBottom: '30px'}}
          src={NullstateImage}
          alt='https://static.veritone.com/veritone-ui/default-nullstate.svg'
        />
        <div className={styles.titleText}>
          Select a content template to add
        </div>
      </div>
    )
  }
}