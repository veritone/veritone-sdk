import React from 'react';
import { string, bool, func } from 'prop-types';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';

export default function Paragraph({
  name,
  label,
  required,
  value,
  error,
  instruction,
  onChange
}) {
  const handleChange = React.useCallback(
    (_, editor) => onChange({ name, value: editor.getData() }),
    [onChange, name]
  );

  return (
    <FormControl error={error.length > 0} fullWidth>
      <Typography>{`${label || name}` + `${required ? ' *' : ''}`}</Typography>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={handleChange}
        className
      />
      <FormHelperText variant="outlined">{error || instruction}</FormHelperText>
    </FormControl>
  );
}

Paragraph.propTypes = {
  name: string,
  label: string,
  value: string,
  required: bool,
  error: string,
  onChange: func,
  instruction: string
}

Paragraph.defaultProps = {
  onChange: () => {},
  error: ''
}
