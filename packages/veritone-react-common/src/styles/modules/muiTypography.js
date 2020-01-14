// https://github.com/muicss/mui/blob/master/src/sass/mui/mixins/_typography.scss

export const muiTextStyles = {
  'display4': {
    'font-weight': 300,
    'font-size': '112px',
    'line-height': '112px'
  },
  'display3': {
    'font-weight': 400,
    'font-size': '56px',
    'line-height': '56px'
  },
  'display2': {
    'font-weight': 400,
    'font-size': '45px',
    'line-height': '48px'
  },
  'display1': {
    'font-weight': 400,
    'font-size': '34px',
    'line-height': '40px'
  },
  'headline': {
    'font-weight': 400,
    'font-size': '24px',
    'line-height': '32px'
  },
  'title': {
    'font-weight': 400,
    'font-size': '20px',
    'line-height': '28px'
  },
  'subhead': {
    'font-weight': 400,
    'font-size': '16px',
    'line-height': '24px'
  },
  'body2': {
    'font-weight': 500,
    'font-size': '14px',
    'line-height': '20px'
  },
  'body1': {
    'font-weight': 400,
    'font-size': '14px',
    'line-height': '20px'
  },
  'caption': {
    'font-weight': 400,
    'font-size': '12px',
    'line-height': '16px'
  },
  'menu': {
    'font-weight': 500,
    'font-size': '13px',
    'line-height': '17px'
  },
  'button': {
    'font-weight': 500,
    'font-size': '14px',
    'line-height': '18px'
  }
};

export const muiText = (muiName) => {
  const muiStyles = muiTextStyles[muiName];
  const css = {
    fontWeight: `${muiStyles['font-weight']} !important`,
    fontSize: `${muiStyles['font-size']} !important`,
    lineHeight: `${muiStyles['line-height']} !important`,
  }

  if (muiName === 'button') {
    css['textTransform'] = 'uppercase';
  }

  return css;
}
