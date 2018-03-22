import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import defaultStyles from './styles.scss';

export default class PillButton extends Component {
	static propTypes = {
		label: PropTypes.string,
		info: PropTypes.string,
		gapClassName: PropTypes.string,
		labelClassName: PropTypes.string,
		infoClassName: PropTypes.string
	};

	static defaultProps = {};

	render () {
		let {label, info, className, gapClassName, labelClassName, infoClassName} = this.props;
		let hasGap = label && label.length > 0 && info && info.length > 0;

		return (
			<div className={classNames(defaultStyles.pillButton, className)} >
				<div className={classNames(defaultStyles.label, labelClassName)}>
					{label}
				</div>
				{
					hasGap ? <div className={classNames(defaultStyles.gap, gapClassName)}></div> : ''
				}
				<div className={classNames(defaultStyles.info, infoClassName)}>
					{info}
				</div>
			</div>
		);
	}
}