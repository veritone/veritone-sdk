import { create } from 'jss';
import { jssPreset } from '@material-ui/styles';
import { guid } from './util';

const jss = create(jssPreset()).setup({
  createGenerateId: () => () => `vsdk-${guid()}`
})

export function withStyles(styles) {
  const styleSheet = jss.createStyleSheet(styles).attach();
  return styleSheet.classes;
}
