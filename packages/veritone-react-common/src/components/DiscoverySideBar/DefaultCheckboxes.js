import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { isString } from 'lodash';
import {
    string,
    func,
    arrayOf,
    number,
    oneOfType
  } from 'prop-types';


const DefaultCheckboxes = ({ checkboxValues, onCheckboxChange, formComponentIdAtLeaf }) => (
    <div>
        <FormControl>
            <FormGroup>
                {
                    checkboxValues.map((value, index) => {
                        let checkboxValue = value;
                        if (isString(value)) {
                            checkboxValue = value.replace(/\s+/g, '-');
                        }
                        return <FormControlLabel key={value + "" + String(index)}
                            control={
                                <Checkbox
                                    id={formComponentIdAtLeaf}
                                    color="primary"
                                    value={checkboxValue}
                                    onChange={onCheckBoxChange}
                                />
                            }
                            label={value}
                        />
                    })
                }
            </FormGroup>
        </FormControl>
    </div>
)

export default DefaultCheckboxes;

DefaultCheckboxes.propTypes = {
    onCheckboxChange: func,
    formComponentIdAtLeaf: string,
    checkboxValues: arrayOf(oneOfType([string, number]))
  }