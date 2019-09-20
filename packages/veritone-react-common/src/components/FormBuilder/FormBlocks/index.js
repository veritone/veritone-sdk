import React from 'react';
import { string, func, node } from 'prop-types';
import { noop } from 'lodash';
import Typography from '@material-ui/core/Typography';
import Title from '@material-ui/icons/Title';
import RadioButtonChecked from '@material-ui/icons/RadioButtonChecked';
import CheckBoxOutlined from '@material-ui/icons/CheckBoxOutlined';
import CalendarToday from '@material-ui/icons/CalendarToday';
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
import Notes from '@material-ui/icons/Notes';
import ExposurePlus1 from '@material-ui/icons/ExposurePlus1';
import MenuIcon from '@material-ui/icons/Menu';
import EditAttributesIcon from '@material-ui/icons/EditAttributes';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { form } from '../configuration';
import styles from './styles.scss';

export const blockTypes = [
  {
    type: 'textInput',
    label: 'Input Text',
    icon: <Title />
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    icon: <Notes />,
  },
  {
    type: 'radio',
    label: 'Radio',
    icon: <RadioButtonChecked />
  },
  {
    type: 'checkBox',
    label: 'Checkbox',
    icon: <CheckBoxOutlined />
  },
  {
    type: 'dateTime',
    label: 'Date Time',
    icon: <CalendarToday />
  },
  {
    type: 'rating',
    label: 'Rating',
    icon: <StarBorderOutlined />
  },
  {
    type: 'select',
    label: 'Select',
    icon: <MenuIcon />
  },
  {
    type: 'switch',
    label: 'Switch',
    icon: <EditAttributesIcon />
  },
  {
    type: 'number',
    label: 'Number',
    icon: <ExposurePlus1 />
  }
];

export const blockMaps = blockTypes.reduce((blocks, { type, label, icon }) => ({
  ...blocks,
  [type]: {
    label,
    icon
  }
}), {});

export function BlockPreview({ type }) {
  return (
    <div className={styles['drag-preview-container']}>
      {blockMaps[type].icon}
      <Typography className={styles['preview-text']}>{blockMaps[type].label}</Typography>
    </div>
  )
}

BlockPreview.propTypes = {
  type: string
}

export default function Block({ type, label, icon, onCancel, onClick }) {
  const [{ opacity }, drag, preview] = useDrag({
    item: {
      id: type,
      type: form,
      isBlock: true
    },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop() && !isNaN(item.index)) {
        onCancel(item.index);
      }
    }
  });

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, []);


  return (
    <div
      ref={drag}
      style={{ opacity }}
      className={styles['block-container']}
      onClick={onClick}
    >
      {icon}
      <Typography
        variant="caption"
        className={styles['block-text']}
      >
        {label}
      </Typography>
    </div>
  )
}

Block.propTypes = {
  type: string,
  label: string,
  icon: node,
  onCancel: func,
  onClick: func
}

Block.defaultProps = {
  onCancel: noop,
  onClick: noop
}
