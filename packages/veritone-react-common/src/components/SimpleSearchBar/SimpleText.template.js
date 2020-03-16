import React, { Fragment } from 'react';

/**
 * Simple text component, takes string and returns it as react component
 * @param text
 * @returns {*}
 * @constructor
 */
export const SimpleText = text => <Fragment>{text}</Fragment>;
