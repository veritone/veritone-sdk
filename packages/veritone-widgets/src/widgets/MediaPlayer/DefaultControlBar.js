import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { get } from 'lodash';
import { bindActionCreators } from 'redux';
import {
  VolumeMenuButton,
  ControlBar,
  ReplayControl,
  ForwardControl,
  PlayToggle,
  playerActions,
  videoActions
} from 'video-react';
import { shape, objectOf, any, bool } from 'prop-types';

import RestartMediaButton from './RestartMediaButton';
import styles from './styles.scss';

@connect(
  state => ({
    playerState: state.player,
    hasStarted: state.player.hasStarted
  }),
  dispatch => ({
    videoReactActions: bindActionCreators(
      { ...playerActions, ...videoActions },
      dispatch
    )
  })
)
export default class DefaultControlBar extends React.Component {
  static propTypes = {
    playerRef: shape({
      current: objectOf(any)
    }),
    hasStarted: bool
  };
  static defaultProps = {};

  render() {
    const manager = get(this.props.playerRef, 'current.manager');
    let player, actions, store;
    if (manager) {
      player = manager.getState().player;
      actions = manager.getActions();
      store = manager.store;
    }

    if (!manager) {
      return null;
    }

    return (
      <div
        className={cx('video-react', {
          'video-react-has-started': this.props.hasStarted
        })}
        style={{ position: 'static' }}
      >
        <ControlBar
          className={cx(styles.mediaPlayer)}
          // need to provide these manually because ControlBar is
          // supposed to be a child of Player and get them automatically
          player={player}
          manager={manager}
          actions={actions}
          store={store}
        >
          <RestartMediaButton order={1.1} />
          <ReplayControl seconds={10} order={1.2} />
          <ForwardControl seconds={10} order={1.3} />
          <PlayToggle order={2} />
          <VolumeMenuButton vertical order={7} />
        </ControlBar>
      </div>
    );
  }
}
