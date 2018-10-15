export const SHORTCUT_KEY_PRESSED =
  'user pressed one of the keys registered as a shortcut';

export const shortcutKeyPressed = (keyCode, modifiers = {}) => ({
  type: SHORTCUT_KEY_PRESSED,
  payload: { keyCode, modifiers }
});
