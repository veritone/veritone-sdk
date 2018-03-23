import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import IconButton from 'material-ui/IconButton';
import ZoomOutMap from 'material-ui-icons/ZoomOutMap';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import EngineOutputHeader from '../EngineOutputHeader';
import PillButton from '../Parts/Buttons/PillButton';
import { msToReadableString } from '../../helpers/time'
import styles from './styles.scss';

export default class LogoDetectionEngineOutput extends Component {
	static propTypes = {
		label: PropTypes.string,
		data: PropTypes.arrayOf(Object),
		mediaPlayerTime: PropTypes.number,
		className: PropTypes.string,
		headerClassName: PropTypes.string,
		bodyClassName: PropTypes.string,
		itemClassName: PropTypes.string,
		itemLabelClassName: PropTypes.string,
		itemInfoClassName: PropTypes.string,
		onItemSelected: PropTypes.func,
		onEngineSelected: PropTypes.func,
		onExpandViewClicked: PropTypes.func
	};

	static defaultProps = {
		label: 'Logo Recognition',
		data: [],
		mediaPlayerTime: -1
	};

	constructor(props) {
		super(props);
		this.state = {
			isExpanded: false
		};

		this.onEngineChanged = this.onEngineChanged.bind(this);
		this.onExpandViewClicked = this.onExpandViewClicked.bind(this);
	}

	//================================================================================
	//=============================Interaction Functions==============================
	//================================================================================
	onItemSelected = item => (event) => {
		let itemInfo = {
			item: item,
			sourceEngineId: this.state.sourceEngineId || this.props.data[0].sourceEngineId
		}

		if (this.props.onItemSelected) this.props.onItemSelected(itemInfo);
	}

	onEngineChanged(event) {
		let selectedID = event.target.value;
		this.setState({
			sourceEngineId: selectedID
		});

		if (this.props.onEngineSelected) this.props.onEngineSelected(selectedID);
	}

	onExpandViewClicked(event) {
		let newStatus = !this.state.isExpanded;
		this.setState({
			isExpanded: newStatus
		});

		if (this.props.onExpandViewClicked) this.props.onExpandViewClicked(newStatus);
	}

	//================================================================================
	//================================Helper Functions================================
	//================================================================================
	/**
	 * draw engine dropdown selections
	 * @param {Array<{sourceEngineId:string, sourceEngineName:string, taskId: string, series:Array>} data - engine output data
	 * @return MUI Select Element
	 */
	drawEngineSelection(data) {
		if (!data || data.length === 0) return '';

		let selectedID = this.state.sourceEngineId || data[0].sourceEngineId;
		return (
			<Select value={selectedID} onChange={this.onEngineChanged}>
				{
					data.map((engineInfo) => {
						return (
							<MenuItem
								value={engineInfo.sourceEngineId}
								key={'engine-logo-' + engineInfo.sourceEngineId}
							>
								{engineInfo.sourceEngineName}
							</MenuItem>
						);
					})
				}
			</Select>
		);
	}

	/**
	 * Draw detected logo entry in the series
	 * @param {Array<{sourceEngineId:string, series:Array<{startTimeMs:number, endTimeMs:number, logo:{label:string}}>>} data - engine output data
	 * @return {Array<PillButton>}
	 */
	drawItems(data) {
		let currentPlayTime = this.props.mediaPlayerTime;
		let itemClassName = this.props.itemClassName;
		let itemInfoClassName = this.props.itemInfoClassName;
		let itemLabelClassName = this.props.itemLabelClassName;
		let selectedEngineID = this.state.sourceEngineId || data[0].sourceEngineId;

		let items = [];
		if (data && data.length > 0) {
			data.map((engineInfo) => {
				if (engineInfo.sourceEngineId === selectedEngineID) {									//Look for selected engine

					// Sort detected logos by there start time and end time
					engineInfo.series.sort(function (item1, item2) {
						let startTimeDiff = item1.startTimeMs - item2.startTimeMs;
						if (startTimeDiff !== 0) return startTimeDiff;
						else return item1.endTimeMs - item2.endTimeMs;
					});

					// Draw detected logos in the series
					engineInfo.series.map((itemInfo, index) => {
						if (itemInfo.logo) {															//Look for detected logo
							let startTime = msToReadableString(itemInfo.startTimeMs);
							let endTime = msToReadableString(itemInfo.endTimeMs);
							let logoItem = (
								<PillButton
									value={index}
									label={itemInfo.logo.label}
									info={startTime + ' - ' + endTime}
									className={classNames(styles.item, itemClassName)}
									labelClassName={classNames(styles.label, itemLabelClassName)}
									infoClassName={itemInfoClassName}
									key={'logo-' + engineInfo.sourceEngineId + index}
									onClick={this.onItemSelected(itemInfo)}
									highlight={(itemInfo.startTimeMs <= currentPlayTime) ? true : false}
								/>
							);
							items.push(logoItem);
						}
					});
				}
			});
		}
		return items;
	}

	//================================================================================
	//================================Render Function=================================
	//================================================================================
	render() {
		let {
			data,
			label,
			className,
			headerClassName,
			bodyClassName
		} = this.props;

		return (
			<div className={(this.state.isExpanded) ? classNames(styles.logoDetection, styles.expanded, className) : classNames(styles.logoDetection, className)}>
				{/* -----Header----- */}
				<EngineOutputHeader title={label} className={headerClassName}>
					<div className={styles.headerRight}>
						{/* -----Engine Selection----- */}
						<div>
							{this.drawEngineSelection(data)}
						</div>

						{/* -----Fullscreen button----- */}
						<div>
							<IconButton onClick={this.onExpandViewClicked}>
								<ZoomOutMap />
							</IconButton>
						</div>
					</div>
				</ EngineOutputHeader>

				{/* -----Body----- */}
				<div className={classNames(styles.logoDetectionBody, bodyClassName)}>
					{
						/* -----Detected Logos----- */
						this.drawItems(data)
					}
				</div>
			</div>
		);
	}
}