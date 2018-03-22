import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import defaultStyles from './styles.scss';

export default class PillButton extends Component {
	static propTypes = {
		label: PropTypes.string,
		info: PropTypes.string,
		style: PropTypes.object,
		gapStyle: PropTypes.object,
		labelStyle: PropTypes.object,
		infoStyle: PropTypes.object,
		className: PropTypes.string,
		gapClassName: PropTypes.string,
		labelClassName: PropTypes.string,
		infoClassName: PropTypes.string
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
			infoClassName
		} = this.props;
		let hasGap = label && label.length > 0 && info && info.length > 0;

		return (
			<div className={classNames(defaultStyles.pillButton, className)} style={style} onClick={this.props.onClick}>
				<div className={classNames(defaultStyles.label, labelClassName)} style={labelStyle}>
					{label}
				</div>
				{
					hasGap ? <div className={classNames(defaultStyles.gap, gapClassName)} style={gapStyle}></div> : ''
				}
				<div className={classNames(defaultStyles.info, infoClassName)} style={infoStyle}>
					{info}
				</div>
			</div>
		);
	}
}