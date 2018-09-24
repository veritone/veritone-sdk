import { countBy, isString, compact } from 'lodash';

export default {
  nodes: {
    nodeName(nodeName, allNodes) {
      if (!nodeName) {
        return 'Required';
      }

      const maxChars = 25;
      if (nodeName.length > maxChars) {
        return `Name cannot exceed ${maxChars} characters`;
      }

      const nodeNames = countBy(allNodes, 'nodeName');
      if (nodeNames[nodeName] > 1) {
        return 'Duplicate Node Name';
      }
    },
    ip(ipAddr, allNodes) {
      if (!ipAddr) {
        return 'Required';
      }

      if (!isValidIPAddr(ipAddr)) {
        return 'Invalid IP Address';
      }

      const ipAddresses = countBy(allNodes, 'ip');
      if (ipAddresses[ipAddr] > 1) {
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
};

function isValidIPAddr(ip) {
  if (!ip || !isString(ip)) {
    return false;
  }

  const ipOctets = ip.split('.');

  if (ipOctets.length !== 4 || compact(ipOctets).length !== 4) {
    return false;
  }

  return ipOctets
    .map(Number)
    .every(num => !isNaN(num) && num >= 0 && num <= 255);
}
