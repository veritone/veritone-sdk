import React from 'react';

import {
  arrayOf, 
  string,
  func,
  element
} from 'prop-types';

import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import styles from './styles.scss';

//TODO: icons should pass in the icon elements, so the onClick is included already
export default class ModalHeader extends React.Component {
  static propTypes = {
    title: string,
    icons: arrayOf(element), // supports help, menu, trash, exit
    helpCallback: func,
    menuCallback: func,
    trashCallback: func,
    exitCallback: func
  };
  static defaultProps = {
    icons: []
  };

  state = {
    help: false,
    menu: false,
    trash: false,
    separator: false,
    exit: true,
    // icons: []
  };

  // componentWillMount = () => {
  //   this.props.icons.forEach(icon => { //TODO: should change to setState
  //     if (icon == 'exit') {
  //       this.setState((prevState, props) => ({
  //         separator: true,
  //         icons: prevState.icons.concat(['separator'])
  //       }));
  //     }
  //     this.setState((prevState, props) => ({
  //       [icon]: true,
  //       icons: prevState.icons.concat([icon])
  //     }));     
  //   });
  // };

  render() {
    // const modalIcons = [...this.props.icons];

    // if (modalIcons.length) {
    //   modalIcons.push(<span className={styles.separator} />)
    // }

    // modalIcons.push(
    //   <IconButton className={styles.exitIcon} aria-label='exit'>
    //     <Icon className='icon-close-exit' />
    //   </IconButton>
    // )
    return (
      <div className={styles.fullScreenTopBar}>
        <div className={styles.topBarTitle}>{this.props.title}</div>
        <div className={styles.iconGroup}>
          {this.props.icons}
        </div>
      </div>
    );
  };
}