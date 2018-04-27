import ISO_369_1 from './language-codes/ISO_369_1';

import ISO_3166_1_ALPHA_2 from './region-codes/ISO_3166_1_ALPHA_2';

// Regular expression to extract IETF language tags with some loose conditions to handle Veritone's legacy format 
const looseIetfRegex = new RegExp(''
  + /(^|[^a-zA-Z0-9])/.source                             //Ignore preceding data
  + /([a-zA-Z]{2,3})/.source                              //Detect language code (2-3 letters)
  + /(\s*-\s*([a-zA-Z]{3}))?/.source                      //Detect extended language code (3 letters)
  + /(\s*-\s*([a-zA-Z]{4}))?/.source                      //Detect script code (4 letters)
  + /(\s*-\s*([a-zA-Z]{2}|\d{3}))?/.source                //Detect region code (2 letters or 3 digits)
  + /(\s*-\s*([a-zA-Z]{5,8}|\d[a-zA-Z]{3}))?/.source      //Detect extra dialects or script variations code
  + /(\s*-\s*[^x-](\s*-\s*([^-]{2,8}))+)?/.source         //Detect extension data (2-8 chars groups separate by dashes)
  + /(\s*-\s*x(\s*-\s*[\da-zA-Z]{1,8})+)?/.source         //Detect private/internal use data (1-8 letters & digits groups separate by dashes)
  + /(\s+[^-]*)?$/.source                                 //Ignore useless trailing data
);

export function extractIetfCode (code) {
  const langCodeLibs = [ISO_369_1];
  const extendedCodeLibs = [];                  //Microlanguages such as Cantonese...
  const scriptCodeLibs = [];                    //Writing Script
  const regionCodeLibs = [ISO_3166_1_ALPHA_2];
  const variationCodeLibs = [];                 //Extra dialects info
  const extensionCodeLibs = [];                 //For future extensions of languages
  const privateUseCodeLibs = [];                //For future internal use

  const ietfParts = code.match(looseIetfRegex);
  if (ietfParts) {
    const langCode = ietfParts[2];
    if (langCode) {
      const language = {};
      // Find primary language info
      let languageData;
      langCodeLibs.every(lib => {
        if (lib.has(langCode)) {
          languageData = lib.get(langCode);
          return false;
        }
        return true;
      })
      
      // Look for language data in extended list if hasn't found one yet
      if (!languageData) {
        extendedCodeLibs.every(lib => {
          if (lib.has(langCode)) {
            languageData = lib.get(langCode);
            return false;
          }
          return true;
        });
      }
      
      language.code = langCode;
      if (languageData) {
        language.data = languageData;
        language.name = languageData.name[0];
      }

      const otherProps = new Map ([
        [4, {name: 'extended', libraries: extendedCodeLibs}],
        [6, {name: 'script', libraries: scriptCodeLibs}],
        [8, {name: 'region', libraries: regionCodeLibs}],
        [10, {name: 'variant', libraries: variationCodeLibs}],
        [11, {name: 'extension', libraries: extensionCodeLibs}],
        [14, {name: 'privateUse', libraries: privateUseCodeLibs}]
      ]);   // otherProps is a list of property names and matching indices of the IETF language tags

      otherProps.forEach((value, key) => {
        const code = ietfParts[key];
        if (code) {
          language[value.name + 'Code'] = code;
          value.libraries.every(lib => {
            if (lib.has(code)) {
              const propData = lib.get(code);
              language[value.name + 'Data'] = propData;
              if (propData.name) {
                language[value.name + 'Name'] = Array.isArray(propData.name) ? propData.name[0] : propData.name;
              }
              return false;
            }
            return true;
          })
        }
      });

      // Generate suggested english name base on the provided data
      let suggestedName = language.name;
      if (language.extendedData) {
        suggestedName = language.extendedData.name[0] + suggestedName;
      }

      if (language.regionData && language.regionData.properties) {
        let regionProperties = language.regionData.properties;
        if (regionProperties.language && regionProperties.language.english) {
          let englishProperties = regionProperties.language.english;
          if (englishProperties.prefix) {
            suggestedName = englishProperties.prefix + suggestedName;
          }
          if (englishProperties.suffix) {
            suggestedName = suggestedName + englishProperties.suffix;
          }
          if (englishProperties.predecessor) {
            suggestedName = englishProperties.predecessor + ' ' + suggestedName;
          }
          if (englishProperties.successor) {
            suggestedName = suggestedName + ' ' + englishProperties.successor;
          }
        }
      }
      language.suggestedName = suggestedName;

      return language;
    }
  }
  return null;
}

export function generateIetfCode (languageInfo) {
  //TODO: finish this function when this is moved to its own package
}
