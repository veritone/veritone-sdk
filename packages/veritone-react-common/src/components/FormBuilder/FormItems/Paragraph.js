import React from 'react';
import { string, bool, func } from 'prop-types';
import cx from 'classnames';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import styles from './styles.scss';

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
    <FormControl
      error={error.length > 0}
      fullWidth
      className={cx(styles['form-item'])}
    >
      {
        label && <Typography component="legend">
          {label + `${required ? '*' : ''}`}
        </Typography>
      }
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
  onChange: () => { },
  error: ''
}
