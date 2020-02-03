/* eslint-disable react/no-deprecated */
import React from 'react';
import { FormControlLabel } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import LinearProgress from '@material-ui/core/LinearProgress';
import { bool, func, string, shape, arrayOf, any } from 'prop-types';

import SearchAutocomplete from '../SearchAutocomplete';
import attachAutocomplete from '../SearchAutocomplete/helper';

import 'whatwg-fetch';

// Tag Autocomplete config:
const tagConfig = {
  identifierType: 'tag',
  searchLibrary: false,
  searchEntity: false,
  // index: ['library:0bf6711e-2773-40d6-bb35-053da384aec7','library:b64ef50a-0a5b-47ff-a403-a9a30f9241a4','library:ca9ddb3f-086f-4756-a34e-d36f1659b398','library:8c826910-47aa-41a3-8cde-68da8b6abc57','library:2426dbe5-eef3-4167-9da8-fb1eeec61c67','library:78a15b54-9230-4e5f-aff3-02de913ebdc5','library:e427a863-b437-49dd-8872-07379f887def','library:898be9b9-9965-44de-9611-27ba1e76124b','library:13e6f4a3-0d5c-4e11-9a30-913e981cb9ad','library:f628256c-4eea-4492-8a1b-05c25427cc0c','library:707b6f83-fd40-48ec-be98-73dccfe7642e','library:f0619e4d-f122-4353-971a-66fb0366fa2b','library:53c896da-173e-49f1-b7a5-bc94d7cb82af','library:ea5a281f-f2f6-4f47-ba06-dc2e3813f46a','library:4b6e8137-6a62-4161-b168-fe201826d9d0','library:1cce3a0e-c121-423c-bdd5-457671f5e6b8','library:cd36e043-4716-42ca-816b-9368f6f1092d','library:e8fb3880-0973-4858-8d3b-21c7765a7be7','library:bff525e2-99cf-4eb7-97bc-8b939a3e3ccc','library:4e84a3bd-6065-4b25-be85-6027dcd7fa31','library:4ad030d9-3b45-4482-9a0f-1739dccdb208','library:ab03d4d1-59f1-4442-be1d-220bc590b9b7','library:fc40a439-e615-4848-891e-ca5c039343e9','library:d64af877-d2fb-44ba-ab75-c1fcac6addca','library:c42b46f2-dc66-4105-8395-f16495aeb1cc','library:b8172bcf-78f9-45f4-b876-534c9ba1de4f','library:a7d732f6-4eb6-4cdf-9257-37fea6c79c1a','library:2277175f-5a26-4199-bdbc-cff3311297b0','library:513c805f-2893-4f49-8814-b2548ef700d6'],  // TODO: Dynamically populate this
  index: ['mine', 'global'], // For object/logo/tags
  customFields: ['tags.displayName'], // For object/logo/tags
  // enableFullTextSearch: true
};

@attachAutocomplete('api/search/autocomplete', tagConfig)
export default class TagSearchModal extends React.Component {
  static defaultProps = {
    modalState: { queryResults: [], queryString: '', exclude: false },
    applyFilter: value => console.log('Search tags by entityId', value),
    cancel: () => console.log('You clicked cancel'),
  };

  // eslint-disable-next-line no-useless-constructor
  constructor(props, defaultProps) {
    super(props, defaultProps);
  }

  static propTypes = {
    open: bool,
    auth: string,
    api: string,
    modalState: shape({
      error: bool,
      queryString: string,
      queryResults: arrayOf(
        shape({
          header: string,
          items: arrayOf(
            shape({
              id: string,
              type: string,
              image: string,
              label: string,
              description: string,
            })
          ),
        })
      ),
      exclude: bool,
    }),
    fetchAutocomplete: func,
    applyFilter: func,
    cancel: func,
    libraries: any,
  };

  state = JSON.parse(
    JSON.stringify({
      ...this.props.modalState,
      queryString: this.props.modalState.label || '',
    })
  );

  componentWillMount() {
    if (this.props.modalState.label) {
      const selectedItem = {
        description: this.props.modalState.description,
        id: this.props.modalState.id,
        image: this.props.modalState.image,
        label: this.props.modalState.label,
        type: this.props.modalState.type,
      };
      this.onChange(this.props.modalState.label);
      this.setState({
        selectedResult: selectedItem,
      });
    }
  }

  onChange = debouncedQueryString => {
    if (debouncedQueryString) {
      this.setState({
        queryResults: [],
        loading: true,
      });
      return this.props
        .fetchAutocomplete(
          debouncedQueryString,
          this.props.auth,
          this.props.api,
          this.props.libraries
        )
        .then(response => {
          this.setState({
            queryResults: response,
            queryString: debouncedQueryString,
            loading: false,
          });
          return debouncedQueryString;
        })
        .catch(() => {
          this.setState({
            error: true,
            queryResults: [],
            loading: false,
          });
          return debouncedQueryString;
        });
    }

    this.setState({
      loading: false,
      queryResults: [],
      queryString: debouncedQueryString,
    });

    return new Promise(resolve => resolve(debouncedQueryString || ''));
  };

  onClickAutocomplete = () => {
    this.onChange(this.state.queryString);
  };

  selectResult = result => {
    if (result) {
      this.setState({
        selectedResult: result,
        queryString: result.label,
      });
    }
  };

  returnValue() {
    if (!this.state.selectedResult) {
      return {};
    }

    return {
      exclude: this.state.exclude,
      ...this.state.selectedResult,
    };
  }

  toggleExclude = event => {
    this.setState({
      exclude: event.target.checked === true,
    });
  };

  render() {
    return (
      <TagSearchForm
        cancel={this.props.cancel}
        onChange={this.onChange}
        showAutocomplete={this.state.showAutocomplete}
        modalState={this.state}
        selectResult={this.selectResult}
        toggleExclude={this.toggleExclude}
        onClickAutocomplete={this.onClickAutocomplete}
        loading={this.state.loading}
      />
    );
  }
}

export const TagSearchForm = ({
  cancel,
  onChange,
  onKeyPress,
  modalState,
  selectResult,
  toggleExclude,
  onClickAutocomplete,
  loading,
}) => (
  <Grid container spacing={8}>
    <Grid item style={{ flex: '1' }}>
      <SearchAutocomplete
        id="tag_autocomplete_container"
        onChange={onChange}
        onKeyPress={onKeyPress}
        cancel={cancel}
        componentState={modalState}
        selectResult={selectResult}
        onClickAutocomplete={onClickAutocomplete}
      />
      {loading ? <LinearProgress style={{ height: '0.1em' }} /> : null}
    </Grid>
    <Grid item>
      <FormControlLabel
        control={
          <Checkbox
            checked={modalState.exclude || false}
            onChange={toggleExclude}
          />
        }
        label="Exclude"
      />
    </Grid>
  </Grid>
);

TagSearchForm.propTypes = {
  cancel: func,
  onChange: func,
  onKeyPress: func,
  modalState: shape({ any }),
  selectResult: func,
  toggleExclude: func,
  onClickAutocomplete: func,
  loading: bool,
};

const TagConditionGenerator = modalState => ({
  operator: 'query_object',
  field: 'tags',
  query: {
    operator: 'term',
    field: 'tags.value',
    value: modalState.id,
    dotNotation: true,
    not: modalState.exclude === true,
  },
});

const TagDisplay = modalState => ({
  abbreviation:
    modalState && modalState.label && modalState.label.length > 10
      ? `${modalState.label.substring(0, 10)}...`
      : modalState.label,
  exclude: modalState.exclude,
  thumbnail: modalState.image,
});

export { TagSearchModal, TagConditionGenerator, TagDisplay };
