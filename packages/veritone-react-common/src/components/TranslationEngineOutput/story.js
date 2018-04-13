import React, { Component } from 'react';
import { bool } from 'prop-types';
import { storiesOf } from '@storybook/react';
import { number } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';

import styles from './story.styles.scss';
import TranslationEngineOutput from './';

storiesOf('TranslationEngineOutput', module)
  .add('Without Lazy Loading', () => {
    return <TranslationExample />;
  })
  .add('With Lazy Loading', () => {
    return <TranslationExample lazyLoading />;
  });

export class TranslationExample extends Component {
  static propTypes = {
    lazyLoading: bool
  };

  state = {
    selectedEngineId: '1',
    engines: [
      { id: '1', name: 'Engine-X' },
      { id: '2', name: 'Engine-Y' },
      { id: '3', name: 'Engine-Z' }
    ],
    languages: languageOptions,
    contents: renderMockData(0, 50000)
  };

  handleDataRequesting = scrollStatus => {
    const newContents = renderMockData(
      scrollStatus.start,
      scrollStatus.stop
    ).concat(this.state.contents);
    this.setState({
      contents: newContents
    });
  };

  render() {
    const state = this.state;
    if (!this.props.lazyLoading) {
      return (
        <TranslationEngineOutput
          contents={state.contents}
          onClick={action('entry clicked')}
          onRerunProcess={action('on rerun')}
          className={styles.outputViewRoot}
          engines={state.engines}
          selectedEngineId={state.selectedEngineId}
          onEngineChange={action('engine changed')}
          onExpandClicked={action('expand clicked')}
          languages={state.languages}
          defaultLanguage={'en-US'}
          onLanguageChanged={action('language changed')}
          mediaPlayerTimeMs={1000 * number('media player time', -1)}
          mediaPlayerTimeIntervalMs={1000}
        />
      );
    } else {
      return (
        <TranslationEngineOutput
          contents={state.contents}
          onClick={action('entry clicked')}
          onRerunProcess={action('on rerun')}
          className={styles.outputViewRoot}
          engines={state.engines}
          selectedEngineId={state.selectedEngineId}
          onEngineChange={action('engine changed')}
          onExpandClicked={action('expand clicked')}
          languages={state.languages}
          defaultLanguage={'en-US'}
          onLanguageChanged={action('language changed')}
          onScroll={this.handleDataRequesting}
          mediaLengthMs={600000}
          neglectableTimeMs={1000}
          estimatedDisplayTimeMs={50000}
          mediaPlayerTimeMs={1000 * number('media player time', -1)}
          mediaPlayerTimeIntervalMs={1000}
        />
      );
    }
  }
}

function renderMockData(
  startTimeMs,
  stopTimeMs,
  languages = ['en-GB', 'en-US', 'fr-FR', 'ja-JP', 'ar-EG', 'es-MX', 'es-ES'],
  errorRatio = 0.1,
  noDataRatio = 0.1
) {
  const numDataChunks = Math.round(Math.random() * 2) + 1;
  const chunkInterval = (stopTimeMs - startTimeMs) / numDataChunks;
  const mockData = [];

  for (let chunkIndex = 0; chunkIndex < numDataChunks; chunkIndex++) {
    const chunkStartTime = startTimeMs + chunkIndex * chunkInterval;
    const chunkStopTime = chunkStartTime + chunkInterval;

    if (Math.random() < errorRatio) {
      mockData.push({
        status: 'error',
        startTimeMs: chunkStartTime,
        stopTimeMs: chunkStopTime
      });
    } else {
      const series = [];
      const numSeries = Math.round(Math.random() * 19) + 1;
      const timeInterval = (chunkStopTime - chunkStartTime) / numSeries;
      for (let seriesIndex = 0; seriesIndex < numSeries; seriesIndex++) {
        const entryStartTime = chunkStartTime + seriesIndex * timeInterval;

        languages.forEach(language => {
          const entry = {
            language: language,
            startTimeMs: entryStartTime,
            stopTimeMs: entryStartTime + timeInterval
          };

          if (Math.random() * (1 - errorRatio) > noDataRatio) {
            //Has Good Data
            const numOptions = Math.round(Math.random() * 5);
            const wordOptions = [];
            for (let optionIndex = 0; optionIndex < numOptions; optionIndex++) {
              let word;
              switch (language) {
                case 'en-US':
                case 'en-GB':
                case 'en-AU':
                  word =
                    enSentences[
                      Math.round(Math.random() * (enSentences.length - 1))
                    ];
                  break;
                case 'ja-JP':
                  word =
                    jaSentences[
                      Math.round(Math.random() * (jaSentences.length - 1))
                    ];
                  break;
                case 'ar-EG':
                  word =
                    arSentences[
                      Math.round(Math.random() * (arSentences.length - 1))
                    ];
                  break;
                default:
                  word =
                    loremSentences[
                      Math.round(Math.random() * (loremSentences.length - 1))
                    ];
              }
              wordOptions.push({
                word: word,
                confidence: Math.random()
              });
            }
            entry.words = wordOptions;
          }
          series.push(entry);
        });
      }

      mockData.push({
        series: series,
        status: 'success',
        startTimeMs: chunkStartTime,
        stopTimeMs: chunkStopTime
      });
    }
  }

  return mockData;
}

const loremSentences = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
  'eque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
  'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?'
];

const enSentences = [
  'Leverage agile frameworks to provide a robust synopsis for high level overviews.',
  'Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition.',
  'Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.',
  'Bring to the table win-win survival strategies to ensure proactive domination.',
  'At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution.',
  'User generated content in real-time will have multiple touchpoints for offshoring.',
  'Capitalize on low hanging fruit to identify a ballpark value added activity to beta test.',
  'Override the digital divide with additional clickthroughs from DevOps.',
  'Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line.?'
];

const jaSentences = [
  '旅短きばリ勢死ゃはめ着名幼チエ治詳会アヘヲ権壊ンれ宅時ラえさ筑索つ署法ん塚騒はぎ省売仏だ',
  '3事タツナ稿険きよらフ能経リわ残68韓はーぱド者権63結ぐそめ著出楽ょてらっ作儀ワホツ窒機ルスニキ図表ヨシハ上81純収た。',
  '回ほう京米しへそ時発わまふっ変本レオヤカ男月ハセク作少ル夕葉女ヘ賞会めそ慣戦法ヱラス筋空86会ソニ隆良ヤユク特五カチ同生利ぜ応今コラユス考未ホ億述脳受ドン。',
  '毎ゃス後前ヲフラケ慎鉱ヲノシヱ団毎転ヘコイ義転コチツノ実浜サヒ事版11端哲控魅7業抑ニウラハ育応更かしすね。',
  '突ヒ南画とのゆへ氏8腕かびげ務備ハキフ永61警楽をのべぞ竹36覧だつ覧京とけ育形お祖心者コロネク間年じフてん燃世劇しひくら。',
  '相ゃをス和事ヘム市島あば本公ワマ花監ば著民新ざごク沖同びぜリ向官かぴ校載をリ防吟ゃ開経ヨモニ測件カミイ夫頭夫相ごゅの毎直そ定込ヘ企予トハホシ工子終とすぞ。',
  '帳価東コモト品験需5乱ウ図三ス性日ゆけ近供さ権彩ロシ者事ドきご造康くゅえが料機ですどわ意取リてレ。',
  '出れげイっ敦取そか外7断ワ唱方ル書遅列ね輸紙たと対4族90情ハニ雑害レカ車65段レくク類共ヘメヤコ選景商フ止本カマケム暮冠揺浴譲れきど。'
];

const arSentences = [
  'تحت لهيمنة البرية أن. أملاً عليها بها ثم. مليون الساحة الشرقية بل شيء, من لان إحكام الشّعبين واندونيسيا،. قدما الإقتصادية بلا بـ, أن على الدّفاع العمليات. فصل عجّل المضي الضغوط ان. عن ألمانيا إستيلاء للأراضي مما, أضف إستعمل الإثنان التكاليف و, في أضف قِبل تحرّك عسكرياً.',
  'وفي سكان الأحمر مع, مع وزارة موالية الكونجرس حتى. حكومة الأرواح أن حيث, المشترك بمعارضة البولندي قام عل. بالعمل سليمان، لكل تم, بقعة الحكم الغالي يبق ٣٠. أي ذلك تعديل الخاصّة. ان بلا ساعة أصقاع, ثم أما بزمام تحرّك. حين أن النفط أفريقيا الشّعبين.',
  'شاسعة لإنعدام ثم به،, اكتوبر مسؤولية جعل إذ, من به، العناد السيطرة. أسيا ثانية المضي و جُل. قد يتسنّى ابتدعها الأوروبي فقد, الهادي مليارات أما تم. لم أسر بفرض الطرفين, أن بين خطّة أمدها. من أجزاء بريطانيا-فرنسا بال, تلك لدحر وإعلان هو.',
  'قبل تم المضي الفترة, مع بتطويق بالرّغم الأرضية الى, بخطوط الصعداء التاريخ، وفي أم. الإحتفاظ الأوروبية أم تلك, الدمج وشعار في مكن, تم كلّ الأخذ المؤلّفة. مارد الحيلولة ذلك إذ, لمّ السيطرة الأرواح لم, قد تصفح والحزب انه. أما تكتيكاً الأوروبي عن, الأحمر الحكومة الإتفاقية بل بين. هذه بـ إحتار والروسية, عل سابق مسرح الثالث كان',
  'بل كردة الهجوم بال. عن بتخصيص والنرويج بحق, عرض كل جيما مايو, بها واُسدل تزامناً للإتحاد ثم. بين بـ وبعض استدعى, بـ كلّ الأعمال لتقليعة, عالمية التقليدي الموسوعة يبق بل. ثم ووصف ولاتّساع كلا. ان وبعد بتخصيص العالمية حيث.',
  'عل وتم أجزاء ولكسمبورغ. عرض تم علاقة إستيلاء, لان إذ العناد اسبوعين. دون قررت ليبين والكساد ثم. إذ تشكيل الشتاء، المزيفة بين, أي اتّجة التكاليف جعل.',
  'وسفن أمّا الهادي لم أخذ, فبعد والمعدات أسر عل, أسر بـ لفشل دأبوا. بقعة تطوير في لمّ. حلّت والديون استرجاع وقد ان. وتم تسبب الشتاء الثالث، في, ماذا عُقر العدّ أي بال, شيء سكان الخاسرة أي. هذه ٣٠ فسقط وسمّيت, بحث مايو أوزار قد.',
  'عجّل الإقتصادية أن دون, أحكم ومحاولة تعد ٣٠. هو أوسع بتحدّي باستخدام الا. مع مكّن المارق وإقامة مكن, ومن غينيا أسابيع التّحول ان. ألمّ وتنصيب ذلك ٣٠, شعار الساحل هو حيث, لدحر أفريقيا الشهيرة عن شيء. ما جهة أحدث منتصف, وترك الهادي ثم تلك. وقد إجلاء الصعداء قد, عل أسر وبعد إستعمل.'
];

const languageOptions = [
  { language: 'en-US', name: 'American English' },
  { language: 'en-GB', name: 'British English' },
  { language: 'en-AU', name: 'Australian English' },
  { language: 'fr-FR', name: 'French' },
  { language: 'fr-CA', name: 'Canadian French' },
  { language: 'es-ES', name: 'Spanish' },
  { language: 'es-MX', name: 'Mexican Spanish' },
  { language: 'ja-JP', name: 'Japanese' },
  { language: 'ar-EG', name: 'Arabic' }
];
