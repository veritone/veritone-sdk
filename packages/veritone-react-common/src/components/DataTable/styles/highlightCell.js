import { barelyBlack, greenPrimary, blue1 } from '../../../styles/modules/variables';
import { muiText } from '../../../styles/modules/muiTypography';

const subheadText = muiText('subhead');
export default {
    container: {
        ...subheadText,
        padding: '5px 10px',
        background: barelyBlack,
        borderRadius: 2,
        textAlign: 'center',
        fontWeight: 500,
    },
    green: {
        color: greenPrimary,
    },
    blue: {
        color: blue1,
    }
}