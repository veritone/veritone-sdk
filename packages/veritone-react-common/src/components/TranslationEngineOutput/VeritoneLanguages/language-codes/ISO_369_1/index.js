const ISO_369_1 = new Map([
  ['ab', {
    name: ['Abkhazian'],
    nativeName: ['аҧсуа бызшәа', 'аҧсшәа']
  }],
  ['aa', {
    name: ['Afar'],
    nativeName: ['Afaraf']
  }],
  ['af', {
    name: ['Afrikaans'],
    nativeName: ['Afrikaans']
  }],
  ['ak', {
    name: ['Akan'],
    nativeName: ['Akan']
  }],
  ['sp', {
    name: ['Albanian'],
    nativeName: ['Shqip']
  }],
  ['am', {
    name: ['Amharic'],
    nativeName: ['አማርኛ']
  }],
  ['ar', {
    name: ['Arabic'],
    nativeName: ['العربية']
  }],
  ['an', {
    name: ['Aragonese'],
    nativeName: ['aragonés']
  }],
  ['hy', {
    name: ['Armenian'],
    nativeName: ['Հայերեն']
  }],
  ['as', {
    name: ['Assamese'],
    nativeName: ['অসমীয়া']
  }],
  ['av', {
    name: ['Avaric'],
    nativeName: ['авар мацӀ', 'магӀарул мацӀ']
  }],
  ['ae', {
    name: ['Avestan'],
    nativeName: ['avesta']
  }],
  ['ay', {
    name: ['Aymara'],
    nativeName: ['aymar aru']
  }],
  ['az', {
    name: ['Azerbaijani'],
    nativeName: ['azərbaycan dili']
  }],
  ['bm', {
    name: ['Bambara'],
    nativeName: ['bamanankan']
  }],
  ['ba', {
    name: ['Bashkir'],
    nativeName: ['башҡорт теле']
  }],
  ['eu', {
    name: ['Basque'],
    nativeName: ['euskara', 'euskera']
  }],
  ['be', {
    name: ['Belarusian'],
    nativeName: ['беларуская мова']
  }],
  ['bn', {
    name: ['Bengali'],
    nativeName: ['বাংলা']
  }],
  ['bh', {
    name: ['Bihari'],
    nativeName: ['भोजपुरी']
  }],
  ['bi', {
    name: ['Bislama'],
    nativeName: ['Bislama']
  }],
  ['bs', {
    name: ['Bosnian'],
    nativeName: ['bosanski jezik']
  }],
  ['br', {
    name: ['Breton'],
    nativeName: ['brezhoneg']
  }],
  ['bg', {
    name: ['Bulgarian'],
    nativeName: ['български език']
  }],
  ['my', {
    name: ['Burmese'],
    nativeName: ['ဗမာစာ']
  }],
  ['ca', {
    name: ['Catalan', 'Valencian'],
    nativeName: ['català', 'valencià']
  }],
  ['ch', {
    name: ['Chamorro'],
    nativeName: ['Chamoru']
  }],
  ['ce', {
    name: ['Chechen'],
    nativeName: ['нохчийн мотт']
  }],
  ['ny', {
    name: ['Chichewa', 'Chewa', 'Nyanja'],
    nativeName: ['chiCheŵa', 'chinyanja']
  }],
  ['zh', {
    name: ['Chinese'],
    nativeName: ['中文', '汉语', '漢語']
  }],
  ['cv', {
    name: ['Chuvash'],
    nativeName: ['чӑваш чӗлхи']
  }],
  ['kw', {
    name: ['Cornish'],
    nativeName: ['Kernewek']
  }],
  ['co', {
    name: ['Corsican'],
    nativeName: ['corsu', 'lingua corsa']
  }],
  ['cr', {
    name: ['Cree'],
    nativeName: ['ᓀᐦᐃᔭᐍᐏᐣ']
  }],
  ['hr', {
    name: ['Croatian'],
    nativeName: ['hrvatski jezik']
  }],
  ['cs', {
    name: ['Czech'],
    nativeName: ['čeština', 'český jazyk']
  }],
  ['da', {
    name: ['Danish'],
    nativeName: ['dansk']
  }],
  ['dv', {
    name: ['Divehi', 'Dhivehi', 'Maldivian'],
    nativeName: ['ދިވެހި']
  }],
  ['nl', {
    name: ['Dutch', 'Flemish'],
    nativeName: ['Nederlands', 'Vlaams']
  }],
  ['dz', {
    name: ['Dzongkha'],
    nativeName: ['རྫོང་ཁ']
  }],
  ['en', {
    name: ['English'],
    nativeName: ['English']
  }],
  ['eo', {
    name: ['Esperanto'],
    nativeName: ['Esperanto']
  }],
  ['et', {
    name: ['Estonian'],
    nativeName: ['eesti', 'eesti keel']
  }],
  ['ee', {
    name: ['Ewe'],
    nativeName: ['Eʋegbe']
  }],
  ['fo', {
    name: ['Faroese'],
    nativeName: ['føroyskt']
  }],
  ['fj', {
    name: ['Fijian'],
    nativeName: ['vosa Vakaviti']
  }],
  ['fl', {
    name: ['Filipino'],
    nativeName: ['Pilipino']
  }],
  ['fi', {
    name: ['Finnish'],
    nativeName: ['suomi', 'suomen kieli']
  }],
  ['fr', {
    name: ['French'],
    nativeName: ['français', 'langue française']
  }],
  ['ff', {
    name: ['Fulah'],
    nativeName: ['Fulfulde', 'Pulaar', 'Pular']
  }],
  ['gl', {
    name: ['Galician'],
    nativeName: ['Galego']
  }],
  ['ka', {
    name: ['Georgian'],
    nativeName: ['ქართული']
  }],
  ['de', {
    name: ['German'],
    nativeName: ['Deutsch']
  }],
  ['el', {
    name: ['Greek'],
    nativeName: ['ελληνικά']
  }],
  ['gn', {
    name: ['Guaraní'],
    nativeName: ['Avañe\'ẽ']
  }],
  ['gu', {
    name: ['Gujarati'],
    nativeName: ['ગુજરાતી']
  }],
  ['ht', {
    name: ['Haitian', 'Haitian Creole'],
    nativeName: ['Kreyòl ayisyen']
  }],
  ['ha', {
    name: ['Hausa'],
    nativeName: ['هَوُسَ']
  }],
  ['he', {
    name: ['Hebrew'],
    nativeName: ['עברית']
  }],
  ['hz', {
    name: ['Herero'],
    nativeName: ['Otjiherero']
  }],
  ['hi', {
    name: ['Hindi'],
    nativeName: ['हिन्दी', 'हिंदी']
  }],
  ['ho', {
    name: ['Hiri Motu'],
    nativeName: ['Hiri Motu']
  }],
  ['hu', {
    name: ['Hungarian'],
    nativeName: ['magyar']
  }],
  ['ia', {
    name: ['Interlingua'],
    nativeName: ['Interlingua']
  }],
  ['id', {
    name: ['Indonesian'],
    nativeName: ['Bahasa Indonesia']
  }],
  ['ie', {
    name: ['Interlingue'],
    nativeName: ['Occidental', 'Interlingue']
  }],
  ['ga', {
    name: ['Irish'],
    nativeName: ['Gaeilge']
  }],
  ['ig', {
    name: ['Igbo'],
    nativeName: ['Asụsụ Igbo']
  }],
  ['ik', {
    name: ['Inupiaq'],
    nativeName: ['Iñupiaq', 'Iñupiatun']
  }],
  ['io', {
    name: ['Ido'],
    nativeName: ['Ido']
  }],
  ['is', {
    name: ['Icelandic'],
    nativeName: ['Íslenska']
  }],
  ['it', {
    name: ['Italian'],
    nativeName: ['Italiano']
  }],
  ['iu', {
    name: ['Inuktitut'],
    nativeName: ['ᐃᓄᒃᑎᑐᑦ']
  }],
  ['ja', {
    name: ['Japanese'],
    nativeName: ['日本語']
  }],
  ['jv', {
    name: ['Javanese'],
    nativeName: ['Basa Jawa', 'ꦧꦱꦗꦮ']
  }],
  ['kl', {
    name: ['Kalaallisut', 'Greenlandic'],
    nativeName: ['kalaallisut', 'kalaallit oqaasii']
  }],
  ['kn', {
    name: ['Kannada'],
    nativeName: ['ಕನ್ನಡ']
  }],
  ['kr', {
    name: ['Kanuri'],
    nativeName: ['Kanuri']
  }],
  ['ks', {
    name: ['Kashmiri'],
    nativeName: ['कश्मीरी','كشميري‎']
  }],
  ['kk', {
    name: ['Kazakh'],
    nativeName: ['қазақ тілі']
  }],
  ['km', {
    name: ['Cambodian', 'Khmer', 'Central Khmer'],
    nativeName: ['ខ្មែរ', 'ខេមរភាសា', 'ភាសាខ្មែរ']
  }],
  ['ki', {
    name: ['Kikuyu', 'Gikuyu'],
    nativeName: ['Gĩkũyũ']
  }],
  ['rw', {
    name: ['Kinyarwanda'],
    nativeName: ['Ikinyarwanda']
  }],
  ['ky', {
    name: ['Kirghiz', 'Kyrgyz'],
    nativeName: ['Кыргызча', 'Кыргыз тили']
  }],
  ['kv', {
    name: ['Komi'],
    nativeName: ['коми кыв']
  }],
  ['kg', {
    name: ['Kongo'],
    nativeName: ['Kikongo']
  }],
  ['ko', {
    name: ['Korean'],
    nativeName: ['한국어']
  }],
  ['ku', {
    name: ['Kurdish'],
    nativeName: ['كوردی‎', 'Kurdî']
  }],
  ['kj', {
    name: ['Kuanyama'],
    nativeName: ['Kuanyama', 'Kwanyama']
  }],
  ['la', {
    name: ['Latin'],
    nativeName: ['latine', 'lingua latina']
  }],
  ['lb', {
    name: ['Luxembourgish', 'Letzeburgesch'],
    nativeName: ['Lëtzebuergesch']
  }],
  ['lg', {
    name: ['Ganda'],
    nativeName: ['Luganda']
  }],
  ['li', {
    name: ['Limburgan', 'Limburger', 'Limburgish'],
    nativeName: ['Limburgs']
  }],
  ['ln', {
    name: ['Lingala'],
    nativeName: ['Lingála']
  }],
  ['lo', {
    name: ['Lao'],
    nativeName: ['ພາສາລາວ']
  }],
  ['lt', {
    name: ['Lithuanian'],
    nativeName: ['lietuvių kalba']
  }],
  ['lu', {
    name: ['Latvian'],
    nativeName: ['latviešu valoda']
  }],
  ['gv', {
    name: ['Manx'],
    nativeName: ['Gaelg', 'Gailck']
  }],
  ['mk', {
    name: ['Macedonian'],
    nativeName: ['македонски јазик']
  }],
  ['mg', {
    name: ['Malagasy'],
    nativeName: ['fiteny malagasy']
  }],
  ['ms', {
    name: ['Malay'],
    nativeName: ['بهاس ملايو‎', 'Bahasa Melayu']
  }],
  ['ml', {
    name: ['Malayalam'],
    nativeName: ['മലയാളം']
  }],
  ['mt', {
    name: ['Maltese'],
    nativeName: ['Malti']
  }],
  ['mi', {
    name: ['Maori'],
    nativeName: ['te reo Māori']
  }],
  ['mr', {
    name: ['Marathi'],
    nativeName: ['मराठी']
  }],
  ['mh', {
    name: ['Marshallese'],
    nativeName: ['Kajin M̧ajeļ']
  }],
  ['mn', {
    name: ['Mongolian'],
    nativeName: ['Монгол хэл']
  }],
  ['na', {
    name: ['Nauru'],
    nativeName: ['Dorerin Naoero']
  }],
  ['nv', {
    name: ['Navajo', 'Navaho'],
    nativeName: ['Diné bizaad']
  }],
  ['nd', {
    name: ['North Ndebele'],
    nativeName: ['isiNdebele']
  }],
  ['ne', {
    name: ['Nepali'],
    nativeName: ['नेपाली']
  }],
  ['ng', {
    name: ['Ndonga'],
    nativeName: ['Owambo']
  }],
  ['nb', {
    name: ['Norwegian Bokmål'],
    nativeName: ['Norsk Bokmål']
  }],
  ['nn', {
    name: ['Norwegian Nynorsk'],
    nativeName: ['Norsk Nynorsk']
  }],
  ['no', {
    name: ['Norwegian'],
    nativeName: ['Norsk']
  }],
  ['ii', {
    name: ['Sichuan Yi', 'Nuosu'],
    nativeName: ['ꆈꌠ꒿']
  }],
  ['nr', {
    name: ['South Ndebele'],
    nativeName: ['isiNdebele']
  }],
  ['oc', {
    name: ['Occitan'],
    nativeName: ['occitan', 'lenga d\'òc']
  }],
  ['oj', {
    name: ['Ojibwa'],
    nativeName: ['ᐊᓂᔑᓈᐯᒧᐎᓐ']
  }],
  ['cu', {
    name: ['Church Slavic', 'Church Slavonic', 'Old Church Slavonic', 'Old Slavonic', 'Old Bulgarian'],
    nativeName: ['ѩзыкъ словѣньскъ']
  }],
  ['om', {
    name: ['Oromo'],
    nativeName: ['Afaan Oromoo']
  }],
  ['or', {
    name: ['Oriya'],
    nativeName: ['ଓଡ଼ିଆ']
  }],
  ['os', {
    name: ['Ossetian', 'Ossetic'],
    nativeName: ['ирон æвзаг']
  }],
  ['pa', {
    name: ['Panjabi', 'Punjabi'],
    nativeName: ['ਪੰਜਾਬੀ']
  }],
  ['pi', {
    name: ['Pali'],
    nativeName: ['पाऴि']
  }],
  ['fa', {
    name: ['Persian'],
    nativeName: ['فارسی']
  }],
  ['pl', {
    name: ['Polish'],
    nativeName: ['język polski', 'Polszczyzna']
  }],
  ['ps', {
    name: ['Pashto', 'Pushto'],
    nativeName: ['پښتو']
  }],
  ['pt', {
    name: ['Portuguese'],
    nativeName: ['Português']
  }],
  ['qu', {
    name: ['Quechua'],
    nativeName: ['Runa Simi', 'Kichwa']
  }],
  ['rm', {
    name: ['Romansh'],
    nativeName: ['Rumantsch Grischun']
  }],
  ['rn', {
    name: ['Rundi'],
    nativeName: ['Ikirundi']
  }],
  ['ro', {
    name: ['Romanian', 'Moldavian', 'Moldovan'],
    nativeName: ['Română']
  }],
  ['ru', {
    name: ['Russian'],
    nativeName: ['русский']
  }],
  ['sa', {
    name: ['Sanskrit'],
    nativeName: ['संस्कृतम्']
  }],
  ['sc', {
    name: ['Sardinian'],
    nativeName: ['sardu']
  }],
  ['sd', {
    name: ['Sindhi'],
    nativeName: ['सिन्धी', 'سنڌي، سندھی‎']
  }],
  ['se', {
    name: ['Northern Sami'],
    nativeName: ['Davvisámegiella']
  }],
  ['sm', {
    name: ['Samoan'],
    nativeName: ['gagana fa\'a Samoa']
  }],
  ['sg', {
    name: ['Sango'],
    nativeName: ['yângâ tî sängö']
  }],
  ['sr', {
    name: ['Serbian'],
    nativeName: ['српски језик']
  }],
  ['gd', {
    name: ['Gaelic', 'Scottish Gaelic'],
    nativeName: ['Gàidhlig']
  }],
  ['sn', {
    name: ['Shona'],
    nativeName: ['chiShona']
  }],
  ['si', {
    name: ['Sinhala', 'Sinhalese'],
    nativeName: ['සිංහල']
  }],
  ['sk', {
    name: ['Slovak'],
    nativeName: ['Slovenčina', 'Slovenský Jazyk']
  }],
  ['sl', {
    name: ['Slovenian'],
    nativeName: ['Slovenski Jezik', 'Slovenščina']
  }],
  ['so', {
    name: ['Somali'],
    nativeName: ['Soomaaliga', 'af Soomaali']
  }],
  ['st', {
    name: ['Southern Sotho'],
    nativeName: ['Sesotho']
  }],
  ['es', {
    name: ['Spanish', 'Castilian'],
    nativeName: ['Español']
  }],
  ['su', {
    name: ['Sundanese'],
    nativeName: ['Basa Sunda']
  }],
  ['sw', {
    name: ['Swahili'],
    nativeName: ['Kiswahili']
  }],
  ['ss', {
    name: ['Swati'],
    nativeName: ['SiSwati']
  }],
  ['sv', {
    name: ['Swedish'],
    nativeName: ['Svenska']
  }],
  ['ta', {
    name: ['Tamil'],
    nativeName: ['தமிழ்']
  }],
  ['te', {
    name: ['Telugu'],
    nativeName: ['తెలుగు']
  }],
  ['tg', {
    name: ['Tajik'],
    nativeName: ['тоҷикӣ', 'toçikī', 'تاجیکی‎']
  }],
  ['th', {
    name: ['Thai'],
    nativeName: ['ไทย']
  }],
  ['ti', {
    name: ['Tigrinya'],
    nativeName: ['ትግርኛ']
  }],
  ['bo', {
    name: ['Tibetan'],
    nativeName: ['བོད་ཡིག']
  }],
  ['tk', {
    name: ['Turkmen'],
    nativeName: ['Türkmen', 'Түркмен']
  }],
  ['tl', {
    name: ['Tagalog'],
    nativeName: ['Wikang Tagalog']
  }],
  ['tn', {
    name: ['Tswana'],
    nativeName: ['Setswana']
  }],
  ['to', {
    name: ['Tonga'],
    nativeName: ['Faka Tonga']
  }],
  ['tr', {
    name: ['Turkish'],
    nativeName: ['Türkçe']
  }],
  ['ts', {
    name: ['Tsonga'],
    nativeName: ['Xitsonga']
  }],
  ['tt', {
    name: ['Tatar'],
    nativeName: ['татар теле', 'tatar tele']
  }],
  ['tw', {
    name: ['Twi'],
    nativeName: ['Twi']
  }],
  ['ty', {
    name: ['Tahitian'],
    nativeName: ['Reo Tahiti']
  }],
  ['ug', {
    name: ['Uighur', 'Uyghur'],
    nativeName: ['ئۇيغۇرچە‎', 'Uyghurche']
  }],
  ['uk', {
    name: ['Ukrainian'],
    nativeName: ['Українська']
  }],
  ['ur', {
    name: ['Urdu'],
    nativeName: ['اردو']
  }],
  ['uz', {
    name: ['Uzbek'],
    nativeName: ['Oʻzbek', 'Ўзбек', 'أۇزبېك‎']
  }],
  ['ve', {
    name: ['Venda'],
    nativeName: ['Tshivenḓa']
  }],
  ['vi', {
    name: ['Vietnamese'],
    nativeName: ['Tiếng Việt']
  }],
  ['vo', {
    name: ['Volapük'],
    nativeName: ['Volapük']
  }],
  ['wa', {
    name: ['Walloon'],
    nativeName: ['Walon']
  }],
  ['cy', {
    name: ['Welsh'],
    nativeName: ['Cymraeg']
  }],
  ['wo', {
    name: ['Wolof'],
    nativeName: ['Wollof']
  }],
  ['fy', {
    name: ['Western Frisian'],
    nativeName: ['Frysk']
  }],
  ['xh', {
    name: ['Xhosa'],
    nativeName: ['isiXhosa']
  }],
  ['yi', {
    name: ['Yiddish'],
    nativeName: ['ייִדיש']
  }],
  ['yo', {
    name: ['Yoruba'],
    nativeName: ['Yorùbá']
  }],
  ['za', {
    name: ['Zhuang', 'Chuang'],
    nativeName: ['Saɯ cueŋƅ', 'Saw cuengh']
  }],
  ['zu', {
    name: ['Zulu'],
    nativeName: ['isiZulu']
  }]
]);

export default ISO_369_1;
