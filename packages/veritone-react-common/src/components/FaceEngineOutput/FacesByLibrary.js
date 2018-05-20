import React from 'react';
import cx from 'classnames';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Icon from 'material-ui/Icon';
import {
  shape,
  string,
  objectOf,
  arrayOf,
  func,
  number
} from 'prop-types';

import { isEmpty } from 'lodash';
import noAvatar from 'images/no-avatar.png';
import NoFacesFound from './NoFacesFound';
import styles from './styles.scss';

const FacesByLibrary = ({ faceEntityLibraries, onSelectEntity }) => {
 return isEmpty(faceEntityLibraries)
    ? <NoFacesFound />
    : (
      <div>
        {Object.keys(faceEntityLibraries).map((key, index) => (
          <div key={`faces-by-library-${key}`}>
            <div className={styles.libraryName}>
              <Icon
                className={cx(styles.libraryIcon, 'icon-library-app')}
              />
              <span>
                {`Library: `}
                <strong>
                  {faceEntityLibraries[key].libraryName}
                </strong>
              </span>
            </div>
            <div className={styles.entityCountContainer}>
              {faceEntityLibraries[key].faces.map((face, index) => (
                <Chip
                  key={`face-${face.entityId}`}
                  className={styles.entityCountChip}
                  label={
                    <span>
                      {`${face.fullName} `}
                      <a>({face.count})</a>
                    </span>
                  }
                  avatar={
                    <Avatar
                      className={styles.faceAvatar}
                      src={face.profileImage || noAvatar}
                    />
                  }
                  onClick={onSelectEntity(face.entityId)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
}

FacesByLibrary.propTypes = {
  faceEntityLibraries: objectOf(
    shape({
      faces: arrayOf(
        shape({
          entityId: string,
          fullName: string,
          count: number,
          profileImage: string
        })
      ),
      libraryName: string.isRequired
    })
  ),
  onSelectEntity: func
}

export default FacesByLibrary;
