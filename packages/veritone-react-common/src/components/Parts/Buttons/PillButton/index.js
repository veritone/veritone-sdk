import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import defaultStyles from './styles.scss';

export default class PillButton extends Component {
	static propTypes = {
		label: PropTypes.string,
		info: PropTypes.string,
		style: PropTypes.instanceOf(Object),
		gapStyle: PropTypes.instanceOf(Object),
		labelStyle: PropTypes.instanceOf(Object),
		infoStyle: PropTypes.instanceOf(Object),
		className: PropTypes.string,
		gapClassName: PropTypes.string,
		labelClassName: PropTypes.string,
		infoClassName: PropTypes.string,
		onClick: PropTypes.func
	};

	static defaultProps = {
		style: {},
		gapStyle: {},
		infoStyle: {},
		labelStyle: {}
	};

	render () {
		let {
			label, 
			info, 
			style,
			gapStyle,
			labelStyle,
			infoStyle,
			className, 
			gapClassName, 
			labelClassName, 
			infoClassName,
			onClick
		} = this.props;
		let hasGap = label && label.length > 0 && info && info.length > 0;

		return (
			<div className={classNames(defaultStyles.pillButton, className)} style={style} onClick={onClick}>
				<div className={classNames(defaultStyles.label, labelClassName)} style={labelStyle}>
					{label}
				</div>
				{
					hasGap ? <div className={classNames(defaultStyles.gap, gapClassName)} style={gapStyle}></div> : (null)
				}
				<div className={classNames(defaultStyles.info, infoClassName)} style={infoStyle}>
					{info}
				</div>
			</div>
		);
	}
}