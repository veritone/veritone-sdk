/* eslint-disable react/forbid-prop-types */
import React from 'react';
import Bar from 'veritone-searchbar-react-export';
import { string, any } from 'prop-types';

// todo VTN-26856 Move Advanced Search Bar into veritone-sdk
export const SearchBarAdvanced = ({ width, color = 'indigo', ...props }) => (
  <div style={{ width }}>
    <Bar.SampleSearchBar {...{ ...props, color }} />
  </div>
);

SearchBarAdvanced.propTypes = {
  width: string,
  color: string,
  auth: any,
  enabledEngineCategories: any,
  disableSavedSearch: any,
  onSearch: any,
  api: any,
  libraries: any,
  searchParameters: any,
  addOrModifySearchParameter: any,
  insertMultipleSearchParameters: any,
  removeSearchParameter: any,
  resetSearchParameters: any,
  getCSP: any,
  menuActions: any,
  showLoadSavedSearch: any,
  showSavedSearch: any,
  presetSDOSchema: any,
  presetSDOAttribute: any,
  sourceFilters: any,
  defaultJoinOperator: any
};

export default SearchBarAdvanced;
