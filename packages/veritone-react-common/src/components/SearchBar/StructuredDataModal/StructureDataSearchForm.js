import React from 'react';
import { func, string } from 'prop-types';

import TextField from '@material-ui/core/TextField';


const StructureDataSearchForm = ({
    onCancel,
    defaultValue,
    onChange,
    onKeyPress,
    inputValue
  }) => {
    return (
      <TextField
        id="structuredata_search_field"
        autoFocus
        margin="none"
        defaultValue={defaultValue}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder="Phrase to search"
        fullWidth
      />
    );
  };
  

  StructureDataSearchForm.propTypes = {
    onCancel: func,
    defaultValue : string,
    onChange: func,
    onKeyPress: func,
    inputValue: string
  }
  
  StructureDataSearchForm.defaultProps = {
    onCancel: () => console.log('onCancel event '),
    defaultValue: '',
    onChange: () => console.log('onChange event '),
    onKeyPress: () => console.log('onKeyPress event')
  };

  export {
    StructureDataSearchForm
  };
  