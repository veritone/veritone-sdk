import React, { Component } from 'react'
import { storiesOf } from '@storybook/react';
import { guid } from '../../helpers/guid';
import { findIndex } from 'lodash';

import LocationSelect from './';

class Story extends Component {

    state = {
        boundingBoxes: [],
        step: 1
    }

    handleAddBoundingBox = newBox => {
        if (this.state.boundingBoxes.length) {
            return;
        }

        this.setState(state => ({
            boundingBoxes: [
                ...state.boundingBoxes,
                {
                    ...newBox,
                }
            ]
        }));
    };

    handleDeleteBoundingBox = deletedId => {
        this.setState(state => ({
            boundingBoxes: state.boundingBoxes.filter(({ id }) => id !== deletedId)
        }));
    };

    handleChangeBoundingBox = changedBox => {
        this.setState(state => {
            const affectedIndex = findIndex(state.boundingBoxes, {
                id: changedBox.id
            });

            let newState = {
                boundingBoxes: [...state.boundingBoxes]
            };

            newState.boundingBoxes[affectedIndex] = changedBox;

            return {
                boundingBoxes: newState.boundingBoxes
            };
        });
    };

    onEditAoI = () => {
        this.setState({
            step: 2
        })
    }

    onRemoveAoI = () => {
        this.setState({
            step: 1,
            boundingBoxes: []
        })
    }

    onUpdateStep = (step) => {
        this.setState({
            step: step,
            readOnly: step !== 2
        })
        if (step === 2) {
            const defaultBoundingBox = {
                boundingPoly: [
                    { x: 0, y: 0 },
                    { x: 0, y: 1 },
                    { x: 1, y: 1 },
                    { x: 1, y: 0 }
                ],
                overlayObjectType: "c",
                id: guid()
            }
            this.handleAddBoundingBox(defaultBoundingBox);
        }
    }

    onChangeConfidenceRange = (e) => {
        this.setState({
            selectedConfidenceRange: [...e]
        })
    }

    render() {
        const { boundingBoxes, step } = this.state;
        return (
            <LocationSelect
                onEditAoI={this.onEditAoI}
                onRemoveAoI={this.onRemoveAoI}
                onUpdateStep={this.onUpdateStep}
                boundingBoxes={boundingBoxes}
                handleAddBoundingBox={this.handleAddBoundingBox}
                handleDeleteBoundingBox={this.handleDeleteBoundingBox}
                handleChangeBoundingBox={this.handleChangeBoundingBox}
                step={step}
            />
        )
    }
}

storiesOf('LocationSelect', module)
    .add('Simple test', () => <Story />);
