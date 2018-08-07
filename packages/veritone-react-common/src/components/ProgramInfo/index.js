import React from 'react';
import {
  withTheme,
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core/styles';
import { func, number, string, bool, objectOf, arrayOf, any } from 'prop-types';
import { reduxForm, Form } from 'redux-form';
import blue from '@material-ui/core//colors/blue';
import {
  noop,
  get,
} from 'lodash';
import { withProps } from 'recompose';

import styles from './styles.scss';

@withProps(props => {
  return {
    initialValues: {
      // This provides defaults to the form. Shallow merged with
      // props.initialValues to allow overriding.
      ...props.initialValues
    }
  };
})
@reduxForm({
  form: 'programInfo'
})
class ProgramInfo extends React.Component {
  static propTypes = {
    sourceData: objectOf(any).isRequired,
    canShare: bool,
    organizations: arrayOf(any),
    canSelectAffiliateSources: bool,
    selectedAffiliateSources: arrayOf(any),
    affiliateSources: arrayOf(any),
    onProgramImageSave: func.isRequired,
    onProgramLiveImageSave: func.isRequired,
    onSubmit: func.isRequired, // user-provided callback for result values
    handleSubmit: func.isRequired, // provided by redux-form
    relativeSize: number, // optional - used to scale text sizes from hosting app
    color: string
  };

  static defaultProps = {
    onSubmit: noop,
    relativeSize: 14,
    color: '#2196F3'
  };

  prepareResultData(formResult) {
    const someData = get(formResult, 'someData');
    // TODO: pass up
    // - program data: name

    return {
      data: someData
    };
  }

  handleSubmit = value => {
    this.props.onSubmit(this.prepareResultData(value));
  };

  getTheme = ({ color, relativeSize }) => {
    const theme = createMuiTheme({
      typography: {
        htmlFontSize: relativeSize || 13,
        subheading: {
          fontSize: '1em'
        }
      },
      palette: {
        primary: {
          light: blue[300],
          main: blue[500],
          dark: blue[700]
        },
        secondary: {
          light: blue[300],
          main: blue[500],
          dark: blue[700]
        }
      }
    });
    return theme;
  };

  render() {
    return (
      <MuiThemeProvider
        theme={this.getTheme({
          color: this.props.color,
          relativeSize: this.props.relativeSize
        })}
      >
        <Form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
          <div className={styles.activeSectionContainer}>
            <span>Program Info TOBE implemented</span>
          </div>
        </Form>
      </MuiThemeProvider>
    );
  }
}

export default withTheme()(ProgramInfo);
