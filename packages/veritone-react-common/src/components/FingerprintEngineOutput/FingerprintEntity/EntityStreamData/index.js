import React, { Component } from 'react';
import { number, string, arrayOf, func, shape } from 'prop-types';
import classNames from 'classnames';

import TextButton from '../../../share-components/buttons/TextButton'
import { msToReadableString } from '../../../../helpers/time';

import styles from './styles.scss';

export default class EntityStreamData extends Component {
  static propTypes = {
    data: arrayOf(shape({
      startTimeMs: number,
      stopTimeMs: number,
      object: shape({
        entityId: string,
        confidenced: number
      })
    })).isRequired,
    className: string,
    onClick: func,
    mediaPlayerTimeMs: number
  }

  render () {
    const {
      data,
      className,
      onClick
    } = this.props;

    return (
      <div className={classNames(styles.fingerprintEntityMatches, className)}>
        {
          data.map(entry => {
            const label = msToReadableString(entry.startTimeMs) + ' - ' + msToReadableString(entry.stopTimeMs);
            return (
              <TextButton
                label={label}
                data={entry}
                onClick={onClick}
                key={'entity-match-' + entry.startTimeMs + entry.stopTimeMs}
                className={classNames(styles.textButton)}
              />
            );
          })
        }
      </div>
    )
  }
}