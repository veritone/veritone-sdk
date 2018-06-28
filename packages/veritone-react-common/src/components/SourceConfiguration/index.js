import React from 'react';
import { string, shape, any, arrayOf, objectOf, func } from 'prop-types';
import { get } from 'lodash';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import FilePicker from 'components/FilePicker';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import defaultThumbnail from 'images/cms-sources-null.svg';
import DynamicSelect from './SchemaDrivenSelectForm';
import styles from './styles.scss';

@withMuiThemeProvider
export default class SourceConfiguration extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(objectOf(any)).isRequired,
    source: shape({
      sourceTypeId: string,
      name: string,
      details: objectOf(any)
    }).isRequired, // the source if this is to edit a source
    onInputChange: func.isRequired
  };
  static defaultProps = {};

  state = {
    sourceTypeIndex: 0,
    requiredFields: {},
    openFilePicker: false,
    thumbnailUrl: ''
  };

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillMount = () => {
    const { sourceTypes, source } = this.props;

    // if editing a source, initialize the defaults
    if (source && source.sourceTypeId) {
      const newState = {};
      const sourceTypeIndex = sourceTypes.findIndex(
        sourceType => sourceType.id === source.sourceTypeId
      );

      newState.sourceTypeIndex = Math.max(
        sourceTypeIndex,
        this.state.sourceTypeIndex
      );

      this.setState(newState);
    }
  };

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.source.sourceTypeId !== this.props.source.sourceTypeId) {
      // if editing a source, initialize the defaults
      const sourceTypeIndex = nextProps.sourceTypes.findIndex(
        sourceType => sourceType.id === nextProps.source.sourceTypeId
      );

      if (sourceTypeIndex > -1) {
        this.setState({ sourceTypeIndex });
      }
    }
  }

  handleNameChange = event => {
    this.props.onInputChange({
      name: event.target.value
    });
  };

  handleSourceChange = sourceTypeIndex => {
    if (sourceTypeIndex !== this.state.sourceTypeIndex) {
      const currentFields = {};
      const properties = get(this.props.sourceTypes, [
        sourceTypeIndex,
        'sourceSchema',
        'definition',
        'properties'
      ]);

      if (properties) {
        Object.keys(properties).forEach(field => {
          currentFields[field] = '';
        });
      }

      return this.props.onInputChange({
        sourceTypeId: this.props.sourceTypes[sourceTypeIndex].id,
        details: currentFields
      });
    }
  };

  handleSourceDetailChange = formDetail => {
    this.props.onInputChange({
      details: {
        ...this.props.source.details,
        ...formDetail
      }
    });
  };

  handleThumbnailSelection = fileList => {
    const file = fileList[0];
    const fileReader = new FileReader();

    fileReader.onload = () => {
      this.setState(
        {
          thumbnailUrl: fileReader.result,
          openFilePicker: false
        },
        () => this.props.onInputChange({ thumbnailFile: file })
      );
    };

    fileReader.readAsDataURL(file);
  };

  openFilePicker = () => {
    this.setState({ openFilePicker: true });
  };

  closeFilePicker = () => {
    this.setState({ openFilePicker: false });
  };

  renderFilePicker = () => {
    return (
      <Dialog open={this.state.openFilePicker}>
        <FilePicker
          accept={['image/svg+xml', '.png', '.jpg']}
          height={500}
          width={500}
          onPickFiles={this.handleThumbnailSelection}
          onRequestClose={this.closeFilePicker}
        />
      </Dialog>
    );
  };

  render() {
    const { source } = this.props;

    return (
      <div className={styles['configuration-container']}>
        <div>
          <div className={styles.configurationTitle}>Configuration</div>
          <div className={styles.configurationDescription}>
            Configure your source below by selecting a source type and inputting
            the associated data.
          </div>
          <div className={styles.sourceConfiguration}>
            <FormControl className={styles.formStyle}>
              <div className={styles.container}>
                <div className={styles['avatar-container']}>
                  <Avatar
                    alt={source.name}
                    src={
                      this.state.thumbnailUrl ||
                      source.thumbnailUrl ||
                      defaultThumbnail
                    }
                    classes={{
                      root: styles['avatar-img-container'],
                      img: styles['avatar-img']
                    }}
                  />
                  <div className={styles['avatar-img-cta']}>
                    <span onClick={this.openFilePicker}>Edit</span>
                  </div>
                </div>
                <TextField
                  className={styles.sourceName}
                  required
                  fullWidth
                  margin="dense"
                  id="sourceName"
                  label="Source Name"
                  value={source.name}
                  onChange={this.handleNameChange}
                />
                {this.state.openFilePicker && this.renderFilePicker()}
              </div>
              <DynamicSelect
                sourceTypes={this.props.sourceTypes}
                currentSourceType={this.state.sourceTypeIndex}
                fieldValues={source.details}
                onSelectChange={this.handleSourceChange}
                onSourceDetailChange={this.handleSourceDetailChange}
                errorFields={this.state.requiredFields}
                selectLabel="Select a Source Type"
                helperText="NOTE: Source types available are dynamic based on your ingestion adapter"
              />
            </FormControl>
          </div>
        </div>
      </div>
    );
  }
}
