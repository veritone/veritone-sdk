import React from 'react';

import '../src/styles/global.scss';
import { VeritoneSDKThemeProvider } from '../src/helpers/withVeritoneSDKThemeProvider';

export const decorators = [(Story) => <VeritoneSDKThemeProvider ><Story/></VeritoneSDKThemeProvider>];
