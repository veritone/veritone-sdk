import React from 'react';
import { string, node } from 'prop-types';
import Truncate from 'react-truncate';

// import styles from './styles.scss';


const Ellipsis = ({ type }) => {
  const longText = 'Augue copiosae postulant vix ea, vel quot mucius maluisset ut, ad duo debet suavitate periculis. Impedit scribentur ex sed, qui illum mazim consectetuer ei, his mundi legere vivendum ex. Vix argumentum philosophia et, ius ne idque zril maiorum, vim cu quem nibh. Civibus mandamus eu per. Minim aliquid ad eam, ea qui tale placera'
  return (
    <Truncate lines={3}>
      {longText}
    </Truncate>
  );
};

export default Ellipsis;

// export default class Ellipsis extends React.Component {
//   static propTypes = {
//     // symbol: propTypes.string.isRequired,
//   };

//   render() {
//     // const { } = this.props;
//     return (
//       <Truncate clamp={3}>
//         Augue copiosae postulant vix ea, vel quot mucius maluisset ut, ad duo debet suavitate periculis. Impedit scribentur ex sed, qui illum mazim consectetuer ei, his mundi legere vivendum ex. Vix argumentum philosophia et, ius ne idque zril maiorum, vim cu quem nibh. Civibus mandamus eu per. Minim aliquid ad eam, ea qui tale placera
//       </Truncate>
//     );
//   }
// }