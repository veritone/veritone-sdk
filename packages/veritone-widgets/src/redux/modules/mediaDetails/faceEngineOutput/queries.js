export const getEngineResultsQuery = `
  query engineResults($tdoId: ID!, $engineIds: [ID!]!, $startOffsetMs: Int, $stopOffsetMs: Int) {
    engineResults(id: $tdoId, engineIds: $engineIds, startOffsetMs: $startOffsetMs, stopOffsetMs: $stopOffsetMs) {
      records {
        tdoId
        engineId
        startOffsetMs
        stopOffsetMs
        jsondata
      }
    }
  }`;

export function getEntities(entityIds) {
  return entityIds.map((id, index) => {
    return `
      entity${index}: entity(id:"${id}") {
        id
        name
        libraryId
        library {
          id
          name
        }
        profileImageUrl
        jsondata
      }
    `;
  });
}

export const getLibrariesByType =`
  query libraries($type: String) {
    libraries(type: $type) {
      records {
        id
        name
        libraryType {
          id
          entityTypeName
        }
      }
    }
  }`;
