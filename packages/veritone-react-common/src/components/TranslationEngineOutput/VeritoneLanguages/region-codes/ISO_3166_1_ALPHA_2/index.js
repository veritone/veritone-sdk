/**
  // Map entry example:
  ['XY', {                              <-- (country ISO 3166 code - required)
    name:['Name1', 'Name2', 'Name3'],   <-- (country names - required)
    properties: {                       <-- (optional)
      language: {                       <-- (optional)
        english: {                      <-- (optional)
          predecessor: ['...'],         <-- (optional)
          successor: ['...'],           <-- (optional)
          prefix: ['...'],              <-- (optional)
          suffix: ['...']               <-- (optional)
        }
        native: {                       <-- (optional)
          ...                           <-- (optional)
        }
      }
      ...                               <-- (optional depends on usage)
    }
  }]
 */

const ISO_3166_1_ALPHA_2 = new Map([
  ['AF', {
    name:['Afghanistan']
  }],
  ['AX', {
    name:['Åland Islands']
  }],
  ['AL', {
    name:['Albania']
  }],
  ['DZ', {
    name:['Algeria']
  }],
  ['AS', {
    name:['American Samoa']
  }],
  ['AD', {
    name:['Andorra']
  }],
  ['AO', {
    name:['Angola']
  }],
  ['AI', {
    name:['Anguilla']
  }],
  ['AQ', {
    name:['Antarctica']
  }],
  ['AG', {
    name:['Antigua and Barbuda']
  }],
  ['AR', {
    name:['Argentina']
  }],
  ['AM', {
    name:['Armenia']
  }],
  ['AW', {
    name:['Aruba']
  }],
  ['AU', {
    name:['Australia'],
    properties: {
      language: {
        english: {
          predecessor: ['Australian']
        }
      }
    }
  }],
  ['AT', {
    name:['Austria']
  }],
  ['AZ', {
    name:['Azerbaijan']
  }],
  ['BS', {
    name:['Bahamas']
  }],
  ['BH', {
    name:['Bahrain']
  }],
  ['BD', {
    name:['Bangladesh']
  }],
  ['BB', {
    name:['Barbados']
  }],
  ['BY', {
    name:['Belarus']
  }],
  ['BE', {
    name:['Belgium']
  }],
  ['BZ', {
    name:['Belize']
  }],
  ['BJ', {
    name:['Benin']
  }],
  ['BM', {
    name:['Bermuda']
  }],
  ['BT', {
    name:['Bhutan']
  }],
  ['BO', {
    name:['Bolivia']
  }],
  ['BQ', {
    name:['Bonaire', 'Sint Eustatius and Saba', 'Caribbean Netherlands']
  }],
  ['BA', {
    name:['Bosnia and Herzegovina']
  }],
  ['BW', {
    name:['Botswana']
  }],
  ['BV', {
    name:['Bouvet Island']
  }],
  ['BR', {
    name:['Brazil']
  }],
  ['IO', {
    name:['British Indian Ocean Territory']
  }],
  ['BN', {
    name:['Brunei Darussalam']
  }],
  ['BG', {
    name:['Bulgaria']
  }],
  ['BF', {
    name:['Burkina Faso']
  }],
  ['BI', {
    name:['Burundi']
  }],
  ['CV', {
    name:['Cabo Verde']
  }],
  ['KH', {
    name:['Cambodia']
  }],
  ['CM', {
    name:['Cameroon']
  }],
  ['CA', {
    name:['Canada'],
    properties: {
      language: {
        english: {
          predecessor: ['CANADIAN'],
        }
      }
    }
  }],
  ['KY', {
    name:['Cayman Islands']
  }],
  ['CF', {
    name:['Central African Republic']
  }],
  ['TD', {
    name:['Chad']
  }],
  ['CL', {
    name:['Chile']
  }],
  ['CN', {
    name:['China']
  }],
  ['CX', {
    name:['Christmas Island']
  }],
  ['CC', {
    name:['Cocos (Keeling) Islands']
  }],
  ['CO', {
    name:['Colombia']
  }],
  ['KM', {
    name:['Comoros']
  }],
  ['CG', {
    name:['Congo']
  }],
  ['CD', {
    name:['Democratic Republic of the Congo']
  }],
  ['CK', {
    name:['Cook Islands']
  }],
  ['CR', {
    name:['Costa Rica']
  }],
  ['CI', {
    name:['Ivory Coast', 'Republic of Côte d\'Ivoir', 'Côte d\'Ivoire']
  }],
  ['HR', {
    name:['Croatia']
  }],
  ['CU', {
    name:['Cuba']
  }],
  ['CW', {
    name:['Curaçao']
  }],
  ['CY', {
    name:['Cyprus']
  }],
  ['CZ', {
    name:['Czechia']
  }],
  ['DK', {
    name:['Denmark']
  }],
  ['DJ', {
    name:['Djibouti']
  }],
  ['DM', {
    name:['Dominica']
  }],
  ['DO', {
    name:['Dominican Republic']
  }],
  ['EC', {
    name:['Ecuador']
  }],
  ['EG', {
    name:['Egypt']
  }],
  ['SV', {
    name:['El Salvador']
  }],
  ['GQ', {
    name:['Equatorial Guinea']
  }],
  ['ER', {
    name:['Eritrea']
  }],
  ['EE', {
    name:['Estonia']
  }],
  ['ET', {
    name:['Ethiopia']
  }],
  ['FK', {
    name:['Falkland Islands', 'Malvinask']
  }],
  ['FO', {
    name:['Faroe Islands']
  }],
  ['FJ', {
    name:['Fiji']
  }],
  ['FI', {
    name:['Finland']
  }],
  ['FR', {
    name:['France']
  }],
  ['GF', {
    name:['French Guiana']
  }],
  ['PF', {
    name:['French Polynesia']
  }],
  ['TF', {
    name:['French Southern Territories']
  }],
  ['GA', {
    name:['Gabon']
  }],
  ['GM', {
    name:['Gambia']
  }],
  ['GE', {
    name:['Georgia']
  }],
  ['DE', {
    name:['Germany']
  }],
  ['GH', {
    name:['Ghana']
  }],
  ['GI', {
    name:['Gibraltar']
  }],
  ['GR', {
    name:['Greece']
  }],
  ['GL', {
    name:['Greenland']
  }],
  ['GD', {
    name:['Grenada']
  }],
  ['GP', {
    name:['Guadeloupe']
  }],
  ['GU', {
    name:['Guam']
  }],
  ['GT', {
    name:['Guatemala']
  }],
  ['GG', {
    name:['Guernsey']
  }],
  ['GN', {
    name:['Guinea']
  }],
  ['GW', {
    name:['Guinea-Bissau']
  }],
  ['GY', {
    name:['Guyana']
  }],
  ['HT', {
    name:['Haiti']
  }],
  ['HM', {
    name:['Heard Island and McDonald Islands']
  }],
  ['VA', {
    name:['Vatican City']
  }],
  ['HN', {
    name:['Honduras']
  }],
  ['HK', {
    name:['Hong Kong']
  }],
  ['HU', {
    name:['Hungary']
  }],
  ['IS', {
    name:['Iceland']
  }],
  ['IN', {
    name:['India']
  }],
  ['ID', {
    name:['Indonesia']
  }],
  ['IR', {
    name:['Iran', 'Islamic Republic of Iran']
  }],
  ['IQ', {
    name:['Iraq']
  }],
  ['IE', {
    name:['Ireland']
  }],
  ['IM', {
    name:['Isle of Man']
  }],
  ['IL', {
    name:['Israel']
  }],
  ['IT', {
    name:['Italy']
  }],
  ['JM', {
    name:['Jamaica']
  }],
  ['JP', {
    name:['Japan']
  }],
  ['JE', {
    name:['Jersey']
  }],
  ['JO', {
    name:['Jordan']
  }],
  ['KZ', {
    name:['Kazakhstan']
  }],
  ['KE', {
    name:['Kenya']
  }],
  ['KI', {
    name:['Kiribati']
  }],
  ['KP', {
    name:['North Korea', 'Democratic People\'s Republic of Korea', 'Korea DPR']
  }],
  ['KR', {
    name:['South Korea', 'Republic of Korea']
  }],
  ['KW', {
    name:['Kuwait']
  }],
  ['KG', {
    name:['Kyrgyzstan']
  }],
  ['LA', {
    name:['Lao', 'Lao People\'s Democratic Republic']
  }],
  ['LV', {
    name:['Latvia']
  }],
  ['LB', {
    name:['Lebanon']
  }],
  ['LS', {
    name:['Lesotho']
  }],
  ['LR', {
    name:['Liberia']
  }],
  ['LY', {
    name:['Libya']
  }],
  ['LI', {
    name:['Liechtenstein']
  }],
  ['LT', {
    name:['Lithuania']
  }],
  ['LU', {
    name:['Luxembourg']
  }],
  ['MO', {
    name:['Macao']
  }],
  ['MK', {
    name:['Macedonia']
  }],
  ['MG', {
    name:['Madagascar']
  }],
  ['MW', {
    name:['Malawi']
  }],
  ['MY', {
    name:['Malaysia']
  }],
  ['MV', {
    name:['Maldives']
  }],
  ['ML', {
    name:['Mali']
  }],
  ['MT', {
    name:['Malta']
  }],
  ['MH', {
    name:['Marshall Islands']
  }],
  ['MQ', {
    name:['Martinique']
  }],
  ['MR', {
    name:['Mauritania']
  }],
  ['MU', {
    name:['Mauritius']
  }],
  ['YT', {
    name:['Mayotte']
  }],
  ['MX', {
    name:['Mexico'],
    properties: {
      language: {
        english: {
          predecessor: ['Mexican'],
        }
      }
    }
  }],
  ['FM', {
    name:['Micronesia', 'Federated States of Micronesia']
  }],
  ['MD', {
    name:['Moldova']
  }],
  ['MC', {
    name:['Monaco']
  }],
  ['MN', {
    name:['Mongolia']
  }],
  ['ME', {
    name:['Montenegro']
  }],
  ['MS', {
    name:['Montserrat']
  }],
  ['MA', {
    name:['Morocco']
  }],
  ['MZ', {
    name:['Mozambique']
  }],
  ['MM', {
    name:['Myanmar']
  }],
  ['NA', {
    name:['Namibia']
  }],
  ['NR', {
    name:['Nauru']
  }],
  ['NP', {
    name:['Nepal']
  }],
  ['NL', {
    name:['Netherlands']
  }],
  ['NC', {
    name:['New Caledonia']
  }],
  ['NZ', {
    name:['New Zealand']
  }],
  ['NI', {
    name:['Nicaragua']
  }],
  ['NE', {
    name:['Niger']
  }],
  ['NG', {
    name:['Nigeria']
  }],
  ['NU', {
    name:['Niue']
  }],
  ['NF', {
    name:['Norfolk Island']
  }],
  ['MP', {
    name:['Northern Mariana Islands']
  }],
  ['NO', {
    name:['Norway']
  }],
  ['OM', {
    name:['Oman']
  }],
  ['PK', {
    name:['Pakistan']
  }],
  ['PW', {
    name:['Palau']
  }],
  ['PS', {
    name:['Palestine', 'State of Palestine']
  }],
  ['PA', {
    name:['Panama']
  }],
  ['PG', {
    name:['Papua New Guinea']
  }],
  ['PY', {
    name:['Paraguay']
  }],
  ['PE', {
    name:['Peru']
  }],
  ['PH', {
    name:['Philippines']
  }],
  ['PN', {
    name:['Pitcairn']
  }],
  ['PL', {
    name:['Poland']
  }],
  ['PT', {
    name:['Portugal']
  }],
  ['PR', {
    name:['Puerto Rico']
  }],
  ['QA', {
    name:['Qatar']
  }],
  ['RE', {
    name:['Réunion']
  }],
  ['RO', {
    name:['Romania']
  }],
  ['RU', {
    name:['Russia', 'Russian Federation']
  }],
  ['RW', {
    name:['Rwanda']
  }],
  ['BL', {
    name:['Saint Barthélemy']
  }],
  ['SH', {
    name:['Saint Helena, Ascension and Tristan da Cunha']
  }],
  ['KN', {
    name:['Saint Kitts and Nevis']
  }],
  ['LC', {
    name:['Saint Lucia']
  }],
  ['MF', {
    name:['Saint Martin']
  }],
  ['PM', {
    name:['Saint Pierre and Miquelon']
  }],
  ['VC', {
    name:['Saint Vincent', 'Saint Vincent and the Grenadines']
  }],
  ['WS', {
    name:['Samoa']
  }],
  ['SM', {
    name:['San Marino']
  }],
  ['ST', {
    name:['Sao Tome and Principe']
  }],
  ['SA', {
    name:['Saudi Arabia']
  }],
  ['SN', {
    name:['Senegal']
  }],
  ['RS', {
    name:['Serbia']
  }],
  ['SC', {
    name:['Seychelles']
  }],
  ['SL', {
    name:['Sierra Leone']
  }],
  ['SG', {
    name:['Singapore']
  }],
  ['SX', {
    name:['Sint Maarten']
  }],
  ['SK', {
    name:['Slovakia']
  }],
  ['SI', {
    name:['Slovenia']
  }],
  ['SB', {
    name:['Solomon Islands']
  }],
  ['SO', {
    name:['Somalia']
  }],
  ['ZA', {
    name:['South Africa']
  }],
  ['GS', {
    name:['South Georgia and the South Sandwich Islands']
  }],
  ['SS', {
    name:['South Sudan']
  }],
  ['ES', {
    name:['Spain']
  }],
  ['LK', {
    name:['Sri Lanka']
  }],
  ['SD', {
    name:['Sudan']
  }],
  ['SR', {
    name:['Suriname']
  }],
  ['SJ', {
    name:['Svalbard and Jan Mayen']
  }],
  ['SZ', {
    name:['Swaziland']
  }],
  ['SE', {
    name:['Sweden']
  }],
  ['CH', {
    name:['Switzerland']
  }],
  ['SY', {
    name:['Syria', 'Syrian Arab Republic']
  }],
  ['TW', {
    name:['Taiwan', 'Taiwan, Province of China']
  }],
  ['TJ', {
    name:['Tajikistan']
  }],
  ['TZ', {
    name:['Tanzania']
  }],
  ['TH', {
    name:['Thailand']
  }],
  ['TL', {
    name:['Timor-Leste', 'East Timor']
  }],
  ['TG', {
    name:['Togo']
  }],
  ['TK', {
    name:['Tokelau']
  }],
  ['TO', {
    name:['Tonga']
  }],
  ['TT', {
    name:['Trinidad and Tobago']
  }],
  ['TN', {
    name:['Tunisia']
  }],
  ['TR', {
    name:['Turkey']
  }],
  ['TM', {
    name:['Turkmenistan']
  }],
  ['TC', {
    name:['Turks and Caicos Islands']
  }],
  ['TV', {
    name:['Tuvalu']
  }],
  ['UG', {
    name:['Uganda']
  }],
  ['UA', {
    name:['Ukraine']
  }],
  ['AE', {
    name:['United Arab Emirates', 'Emirates']
  }],
  ['GB', {
    name:['Britain', 'United Kingdom', 'United Kingdom of Great Britain and Northern Ireland'],
    properties: {
      language: {
        english: {
          predecessor: ['British'],
        }
      }
    }
  }],
  ['US', {
    name:['United States', 'United States of America', 'America'],
    properties: {
      language: {
        english: {
          predecessor: ['American'],
        }
      }
    }
  }],
  ['UM', {
    name:['United States Minor Outlying Islands']
  }],
  ['UY', {
    name:['Uruguay']
  }],
  ['UZ', {
    name:['Uzbekistan']
  }],
  ['VU', {
    name:['Vanuatu']
  }],
  ['VE', {
    name:['Venezuela', 'Bolivarian Republic of Venezuela']
  }],
  ['VN', {
    name:['Viet Nam', 'Vietnam']
  }],
  ['VG', {
    name:['British Virgin Islands']
  }],
  ['VI', {
    name:['United States Virgin Islands']
  }],
  ['WF', {
    name:['Wallis and Futuna']
  }],
  ['EH', {
    name:['Western Sahara']
  }],
  ['YE', {
    name:['Yemen']
  }],
  ['ZM', {
    name:['Zambia']
  }],
  ['ZW', {
    name:['Zimbabwe']
  }]
]);

export default ISO_3166_1_ALPHA_2;
