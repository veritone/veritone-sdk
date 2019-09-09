// this hopefully temporary file duplicates all the stuff in
// https://github.com/erikras/redux-form-material-ui/blob/5.0/
// because that library has dependency issues preventing it from working at the moment. We should be able to delete this file and just import from
// that library, once the 5.0 branch is released.
import { Component, createElement } from 'react';

export const isStateLess = (ReactComponent => ReactComponent.prototype && !ReactComponent.prototype.render);

export function createComponent(MaterialUIComponent, mapProps) {
  class InputComponent extends Component {
    getRenderedComponent() {
      return this.component;
    }

    render() {
      return createElement(MaterialUIComponent, {
        ...mapProps(this.props),
        ref: !isStateLess(MaterialUIComponent)
          ? el => (this.component = el)
          : null
      });
    }
  }

  InputComponent.displayName = `ReduxFormMaterialUI${MaterialUIComponent.name}`;
  return InputComponent;
}

export const mapError = ({
  meta: { touched, error, warning } = {},
  input,
  ...props
}) =>
  touched && (error || warning)
    ? {
        ...props,
        ...input,
        error: Boolean(error || warning),
        helperText: error || warning
      }
    : { ...input, ...props };
