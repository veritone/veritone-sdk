import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import styles from './styles.scss';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import ZoomOutMap from 'material-ui-icons/ZoomOutMap';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import EngineOutputHeader from '../EngineOutputHeader';
import PillButton from '../Parts/Buttons/PillButton';

export default class LogoDetectionEngineOutput extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.onItemSelected = this.onItemSelected.bind(this);
        this.onEngineChanged = this.onEngineChanged.bind(this);
        this.onExpandViewClicked = this.onExpandViewClicked.bind(this);
    }

    static propTypes = {
        label: PropTypes.string,
        data: PropTypes.array,
        headerClassName: PropTypes.string,
        bodyClassName: PropTypes.string,
        itemClassName: PropTypes.string,
        itemLabelClassName: PropTypes.string,
        itemInfoClassName: PropTypes.string,
        onItemSelected: PropTypes.func,
        onEngineSelected: PropTypes.func
    };

    static defaultProps = {
        label: 'Logo Recognition',
        data: [],
    };

    render () {
        let {
                data,
                label, 
                className, 
                headerClassName,
                bodyClassName
            } = this.props;
        
        return (
            <div className={classNames(styles.logoDetection, className)}
                ref={(input) => { this.fullscreenDom = input; }}>
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

    //================================================================================
    //=============================Interaction Functions==============================
    //================================================================================
    onItemSelected (value) {
        let itemInfo = {
            item: value,
            sourceEngineId: this.state.sourceEngineId
        }
        
        if (this.props.onItemSelected)      this.props.onItemSelected(itemInfo);
    }

    onEngineChanged (event) {
        let selectedID = event.target.value;
        this.setState({sourceEngineId: selectedID});

        if (this.props.onEngineSelected)     this.props.onEngineSelected(selectedID);
    }

    onExpandViewClicked (event) {
        let ele = this.fullscreenDom;

        if (ele.requestFullscreen) {
            ele.requestFullscreen();
        } else if (ele.webkitRequestFullscreen) {
            ele.webkitRequestFullscreen();
        } else if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen();
        } else if (ele.msRequestFullscreen) {
            ele.msRequestFullscreen();
        } else {
            console.log('Fullscreen API is not supported.');
        }
    }

    //================================================================================
    //================================Helper Functions================================
    //================================================================================
    /**
     * draw engine dropdown selections
     * @param {Array<{sourceEngineId:string, sourceEngineName:string, taskId: string, series:Array>} data - engine output data
     */
    drawEngineSelection (data) {
        if (!data || data.length === 0)                         return '';
        if (!this.state.sourceEngineId && data.length > 0)      this.state.sourceEngineId = data[0].sourceEngineId;
        
        return (
            <Select value={this.state.sourceEngineId} onChange={this.onEngineChanged}>
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

    drawItems (data) {
        let itemClassName = this.props.itemClassName;
        let itemInfoClassName = this.props.itemInfoClassName;
        let itemLabelClassName = this.props.itemLabelClassName;

        let items = [];
        if (data && data.length > 0) {
            data.map((engineInfo) => {
                if (engineInfo.sourceEngineId === this.state.sourceEngineId) {
                    engineInfo.series.map((itemInfo, index) => {
                        if (itemInfo.logo) {
                            let startTime = this.formatTime(itemInfo.startTimeMs);
                            let endTime = this.formatTime(itemInfo.endTimeMs);
                            let logoItem = (
                                <PillButton 
                                    label={itemInfo.logo.label} 
                                    info={startTime + ' - ' + endTime}
                                    className={classNames(styles.item, itemClassName)}
                                    labelClassName={classNames(styles.label, itemLabelClassName)}
                                    infoClassName={itemInfoClassName}
                                    key={'logo-' + engineInfo.sourceEngineId + index}
                                    onClick={(event) => {this.onItemSelected(itemInfo)}}
                                ></PillButton>
                            );
                            items.push(logoItem);
                        }
                    });
                }
            });
        }
        return items;
    }

    formatTime (millisec) {
        let dateObject = new Date(millisec);
        let numDays = dateObject.getUTCDate() - 1;
        let numHours = dateObject.getUTCHours() + numDays * 24;
        let numMinites = dateObject.getUTCMinutes();
        let numSeconds = dateObject.getUTCSeconds();
        let numMilliseconds = dateObject.getUTCMilliseconds();

        let formatedString = '';
        formatedString = formatedString + numHours.toLocaleString(undefined, {minimumIntegerDigits: 2}) + ':';
        formatedString = formatedString + numMinites.toLocaleString(undefined, {minimumIntegerDigits: 2}) + ':';
        formatedString = formatedString + numSeconds.toLocaleString(undefined, {minimumIntegerDigits: 2}) + ':';
        formatedString = formatedString + numMilliseconds.toLocaleString(undefined, {minimumIntegerDigits: 3});
        return formatedString;
    }
}