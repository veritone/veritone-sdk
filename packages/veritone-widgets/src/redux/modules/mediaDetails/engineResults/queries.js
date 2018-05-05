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
