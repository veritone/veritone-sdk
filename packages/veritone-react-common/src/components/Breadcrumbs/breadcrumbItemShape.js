import { string, bool, func } from 'prop-types';

export default {
	id: string.isRequired,
	label: string.isRequired,
	isHidden: bool,
	onClick: func,
};
