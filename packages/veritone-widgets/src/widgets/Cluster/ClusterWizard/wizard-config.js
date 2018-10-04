import { get } from 'lodash';
import validations from './validations';

export default {
  formName: 'new-cluster',
  steps: [
    {
      label: 'General',
      fields: ['name', 'metrics']
    },
    {
      label: 'Nodes',
      fields: ['nodes']
    },
    {
      label: 'Processing',
      fields: ['engines'],
      buttonText: 'Save & Request Installation Bundle'
    }
  ],
  model: {
    fields: {
      name: 'name',
      metrics: 'metrics',
      nodes: 'nodes',
      engines: 'engines'
    },
    requiredFields: ['name', 'engines'],
    initialValues: {
      nodes: [],
      engines: []
    },
    validate(values) {
      const maxChars = 50;

      return {
        name:
          get(values['name'], 'length', 0) > maxChars
            ? `Max length for name cannot exceed ${maxChars} characters`
            : undefined,
        nodes: !get(values['nodes'], 'length', 0)
          ? { _error: 'At least one node must be configured' }
          : validateNodes(values['nodes']),
        engines: !get(values['engines'], 'length', 0)
          ? 'Please specify processing engines'
          : undefined
      };
    }
  }
};

function validateNodes(nodes) {
  const nodeArrayErrors = [];
  const validationFields = Object.keys(validations.nodes);

  nodes.forEach((node, nodeIdx) => {
    const nodeErrors = {};
    validationFields.forEach(validationField => {
      nodeErrors[validationField] = validations.nodes[validationField](
        node[validationField],
        nodes
      );
      if (nodeErrors[validationField]) {
        nodeArrayErrors[nodeIdx] = nodeErrors;
      }
    });
  });

  if (nodeArrayErrors.length) {
    return nodeArrayErrors;
  }
}
