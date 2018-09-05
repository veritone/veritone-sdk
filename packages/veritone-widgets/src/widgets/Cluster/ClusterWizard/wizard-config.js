import { get, countBy, isString, compact } from 'lodash';

const stepperWizardConfig = {
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
      fields: ['engines']
    }
  ],
  model: {
    fields: {
      name: 'name',
      metrics: 'metrics',
      nodes: 'nodes',
      engines: 'engines'
    },
    requiredFields: ['name', 'metrics', 'engines'],
    initialValues: {
      nodes: [],
      engines: []
    },
    validate(values) {
      const maxChars = 50;

      return {
        name: get(values['name'], 'length', 0) > maxChars
          ? `Max length for name cannot exceed ${maxChars} characters`
          : undefined,
        nodes: !get(values['nodes'], 'length', 0) ? { _error: 'At least one node must be configured' } : undefined,
        engines: !get(values['engines'], 'length', 0) ? 'Please specify processing engines' : undefined
      };
    },
    fieldValidations: {
      nodes: {
        nodeName(value, allValues) {
          if (!value) {
            return 'Required';
          }

          const maxChars = 25;
          if (value.length > maxChars) {
            return `Name cannot exceed ${maxChars} characters`;
          }

          const nodeNames = countBy(get(allValues, 'nodes', []), 'nodeName');
          if (nodeNames[value] > 1) {
            return 'Duplicate Node Name';
          }
        },
        ip(value, allValues) {
          if (!value) {
            return 'Required';
          }

          if (!isValidIPAddr(value)) {
            return 'Invalid IP Address';
          }

          const ipAddresses = countBy(get(allValues, 'nodes', []), 'ip');
          if (ipAddresses[value] > 1) {
            return 'Duplicate IP Address';
          }
        },
        disk(value) {
          if (!value) {
            return 'Required';
          }
        },
        cpu(value) {
          if (!value) {
            return 'Required';
          }
        },
        mem(value) {
          if (!value) {
            return 'Required';
          }
        }
      }
    }
  }
};

export default stepperWizardConfig;

function isValidIPAddr(ip) {
  if (!ip || !isString(ip)) {
    return false;
  }

  const ipOctets = compact(ip.split('.'));

  if (ipOctets.length !== 4) {
    return false;
  }

  return ipOctets.map(Number).every(num => !isNaN(num) && num >= 0 && num <= 255)
}
