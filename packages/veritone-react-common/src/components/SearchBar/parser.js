import { guid } from 'helpers/guid';

class SearchBarError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, SearchBarError);
  }
}

function CSPToSearchParameters(cognitiveSearchProfile, lastGroup) {
  //handle case where csp is just a single term without any join groups
  if (cognitiveSearchProfile.state && cognitiveSearchProfile.engineCategoryId) {
    return [
      {
        id: guid(),
        conditionType: cognitiveSearchProfile.engineCategoryId,
        value: cognitiveSearchProfile.state
      }
    ];
  }

  function getJoinOperator(query) {
    const operators = Object.keys(query);
    return operators[0];
  }

  let searchParameters = [];

  const cspJoinOperator = getJoinOperator(cognitiveSearchProfile);
  const joinOperator = cspJoinOperator.replace('(', '');
  const conditions = cognitiveSearchProfile[cspJoinOperator];
  const shouldAddParens = cspJoinOperator.endsWith('(');

  if (shouldAddParens) {
    searchParameters.push({ id: guid(), conditionType: 'group', value: '(' });
  }

  for (let i = 0; i < conditions.length; i++) {
    // if it's an engine category pill, just convert it to a search parameter
    if ('engineCategoryId' in conditions[i]) {
      const newSearchPill = {
        id: guid(),
        conditionType: conditions[i].engineCategoryId,
        value: conditions[i].state
      };
      searchParameters.push(newSearchPill);
    } else {
      // this will always be a subtree in the CSP, so recursively parse it
      const subSearchParameters = CSPToSearchParameters(
        conditions[i],
        cspJoinOperator
      );
      searchParameters = [...searchParameters, ...subSearchParameters];
    }
    // add the joining operator unless it's the very end
    if (i < conditions.length - 1) {
      searchParameters.push({
        id: guid(),
        conditionType: 'join',
        value: joinOperator
      });
    }
  }

  if (shouldAddParens) {
    searchParameters.push({ id: guid(), conditionType: 'group', value: ')' });
  }

  return searchParameters;
}

function getGroupsFromSearchParameters(searchParameters) {
  const groups = {};
  let startOfGroup = null;
  let treeLevel = 0;
  for (let i = 0; i < searchParameters.length; i++) {
    if (searchParameters[i].value === '(') {
      if (treeLevel === 0) {
        startOfGroup = searchParameters[i].id;
      }
      treeLevel++;
    } else if (searchParameters[i].value === ')') {
      treeLevel--;
      if (treeLevel === 0) {
        // we use a recursive descent to render searchParameters.
        // as a result, it's easy to look backwards one parameter, but hard to look forward.
        // afterGroup allows us to figure out how to render nested groups.
        groups[startOfGroup] = {
          endOfGroup: i,
          afterGroup:
            searchParameters[i + 1] && searchParameters[i + 1].conditionType
        };
        startOfGroup = null;
      }
    }
  }

  return groups;
}

export { CSPToSearchParameters, getGroupsFromSearchParameters, SearchBarError };
