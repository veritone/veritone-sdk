export const createJobInsertIntoIndex = `
  mutation createJob($tdoId: ID!) {
    createJob(input: {
      targetId: $tdoId,
      tasks: [{
        engineId: "insert-into-index"
      }]
    }) {
      id
      tasks {
        records {
          id
          jobId
        }
      }
    }
  }`;

export const emitEvent = `
  mutation emitEvent($input: EmitEvent!) {
     emitEvent(input: $input) {
       id
     }
   }
`;
