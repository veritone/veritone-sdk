import React from 'react';
import { storiesOf } from '@storybook/react';

import styles from './story.styles.scss';

import TranscriptEngineOutput from './';

storiesOf('TranscriptEngineOutput', module)
  .add('Base', () => {
    return (
      <TranscriptEngineOutput 
        assets={transcriptAssets} 
        classes={{root: styles.transcriptRoot}}
        tdoStartTime={tdoStartTime}
        tdoEndTime={tdoEndTime}
      />
    );
  })
  .add('EditMode', () => {
    return (
      <TranscriptEngineOutput 
        assets={transcriptAssets} 
        classes={{root: styles.transcriptRoot}} 
        editModeEnabled={true}
        tdoStartTime={tdoStartTime}
        tdoEndTime={tdoEndTime}
      />
    );
  });

// Mock of what we think the data structure will look like.
const transcriptAssets = [
  {
    startTime: 1520444708,
    endTime: 1520444731,
    data: `<?xml version="1.0" encoding="utf-8"?>
    <tt xml:lang="en-us" xmlns="http://www.w3.org/ns/ttml" xmlns:tts="http://www.w3.org/ns/ttml#styling" xmlns:ttm="http://www.w3.org/ns/ttml#metadata">
    <body region="CaptionArea">
    <div>
      <p begin="00:00:00.080" end="00:00:05.580">I have a dream . That 1 day . This</p>
      <p begin="00:00:05.589" end="00:00:10.599">nation will rise up . And live out the true meaning</p>
      <p begin="00:00:10.610" end="00:00:16.340">of its screen . We hold these truths to be self-evident that</p>
      <p begin="00:00:16.350" end="00:00:18.130">all men are created equal .</p>
    </div>
    </body>
    </tt>`
  },
  {
    startTime: 1520444732,
    endTime: 1520445050,
    data: `<?xml version="1.0" encoding="utf-8"?>
    <tt xml:lang="en-us" xmlns="http://www.w3.org/ns/ttml" xmlns:tts="http://www.w3.org/ns/ttml#styling" xmlns:ttm="http://www.w3.org/ns/ttml#metadata">
    <body region="CaptionArea">
    <div>
      <p begin="00:00:03.120" end="00:00:08.650">So you even though we face the difficulty . Of today and tomorrow</p>
      <p begin="00:00:09.930" end="00:00:15.040">I still have a dream . It is a dream deeply</p>
      <p begin="00:00:15.051" end="00:00:21.092">rooted in the American dream . I have a dream that</p>
      <p begin="00:00:21.102" end="00:00:27.305">1 day . This nation will rise up and</p>
      <p begin="00:00:27.315" end="00:00:32.485">live out the true meaning of its creed We hold these truths to be</p>
      <p begin="00:00:32.495" end="00:00:45.626">self-evident that all men are created equal . I</p>
      <p begin="00:00:45.636" end="00:00:50.929">have a dream that 1 day on the red hills of Georgia</p>
      <p begin="00:00:50.929" end="00:00:56.050">. Gone the farm of flames and the fountains of promise</p>
      <p begin="00:00:56.061" end="00:01:01.122">slave on them will bait be able to sit down together at the table</p>
      <p begin="00:01:01.131" end="00:01:07.696">of brotherhood I have a dream that 1 day . Even</p>
      <p begin="00:01:07.707" end="00:01:13.096">the state of Mississippi a state sweltering with the heat of</p>
      <p begin="00:01:13.507" end="00:01:19.248">injustice . Well stirring with the heat of oppression will</p>
      <p begin="00:01:19.288" end="00:01:24.307">be transformed into an oasis is the freedom and justice that I have a dream</p>
      <p begin="00:01:24.307" end="00:01:29.877">. I have 4 little children</p>
      <p begin="00:01:31.407" end="00:01:36.517">will 1 day live in a nation whether they will not be judged by the color of a Baskin but by</p>
      <p begin="00:01:36.528" end="00:01:49.488">the content of that character I happen to have something . I</p>
      <p begin="00:01:49.498" end="00:01:55.360">have a dream that 1 day . Yet</p>
      <p begin="00:01:55.370" end="00:02:01.461">Alabama with its fish racists with its governor having</p>
      <p begin="00:02:01.471" end="00:02:06.721">his lips dripping with the words of it the perception another fixation 1 day right</p>
      <p begin="00:02:06.731" end="00:02:12.031">bad in Alabama little black boys and back not being able to join hands</p>
      <p begin="00:02:12.041" end="00:02:24.850">with a little pride bargain pride girl has sisters and brothers are happy with the . I</p>
      <p begin="00:02:24.861" end="00:02:30.181">have a dream that 1 day every battle shall be exalted never healed</p>
      <p begin="00:02:30.191" end="00:02:35.321">and nothing should be banned local rough places will be made plain and the perfect places</p>
      <p begin="00:02:35.331" end="00:02:40.391">will be made straight and the Purple Hearts of parent feel that all life shall see</p>
      <p begin="00:02:40.401" end="00:02:45.551">it together this is our hope this is the paper that I go</p>
      <p begin="00:02:45.560" end="00:02:50.561">back to the south with with this faith . We will be able</p>
      <p begin="00:02:50.572" end="00:02:55.712">to hew out of the mountain of this path a stone of hope . With this</p>
      <p begin="00:02:55.721" end="00:03:01.202">faith we will be able to transform tangling this called the nation</p>
      <p begin="00:03:01.432" end="00:03:06.452">into a beautiful symphony of brotherhood with this thing we will</p>
      <p begin="00:03:06.461" end="00:03:11.891">be able to work together to pray together to struggle to gather to go to jail together</p>
      <p begin="00:03:12.101" end="00:03:17.162">to stand up for freedom together knowing that we will be free 1 day when</p>
      <p begin="00:03:17.162" end="00:03:22.452">. This will be the stand . This</p>
      <p begin="00:03:22.461" end="00:03:27.582">will be the day when all are going to . Be able to sing with no</p>
      <p begin="00:03:27.592" end="00:03:32.682">meaning my country to . Wheedle and the liberty</p>
      <p begin="00:03:32.692" end="00:03:37.779">of being . Lana grandma fathers died land of the Pilgrim's</p>
      <p begin="00:03:37.819" end="00:03:43.000">pride from every mountainside let freedom ring</p>
      <p begin="00:03:43.009" end="00:03:48.040">to Comerica us to be a great nation this must become true and so</p>
      <p begin="00:03:48.049" end="00:03:53.340">that freedom ring . From the produce just hilltops of New Hampshire let</p>
      <p begin="00:03:53.350" end="00:03:58.540">freedom ring from the might amount to is a New York . That</p>
      <p begin="00:03:58.551" end="00:04:03.741">freedom away from the heightening out again is a Pennsylvania Let freedom ring</p>
      <p begin="00:04:03.751" end="00:04:09.311">from the small cap market is Colorado . Let freedom ring from the question</p>
      <p begin="00:04:09.351" end="00:04:14.813">slopes of California but not only that that freedom ring</p>
      <p begin="00:04:14.853" end="00:04:20.613">from Stone Mountain of soldier . Let freedom ring from Lookout</p>
      <p begin="00:04:20.622" end="00:04:25.883">Mountain of Tennessee that freedom ring from every hill and</p>
      <p begin="00:04:25.892" end="00:04:30.953">molehill of Mississippi is predator free mouth and saw . That</p>
      <p begin="00:04:30.962" end="00:04:36.343">freedom ring and when this happened . When</p>
      <p begin="00:04:36.353" end="00:04:41.663">we had our freedom ring . When we let it ring from every advantage</p>
      <p begin="00:04:41.673" end="00:04:46.803">and ever have that from our 1st state and every city . We</p>
      <p begin="00:04:46.812" end="00:04:52.053">will be able to speed up that day when all of the children not men</p>
      <p begin="00:04:52.062" end="00:04:57.303">and white men Jews and Gentiles Protestants and Catholics will be able</p>
      <p begin="00:04:57.312" end="00:05:02.373">to join hands and sing in the words of the only growth spiritual Free at</p>
      <p begin="00:05:02.382" end="00:05:06.863">last free at last but not a lot of little prayer .</p>
    </div>
    </body>
    </tt>`
  }
];
const tdoStartTime = transcriptAssets[0].startTime;
const tdoEndTime = transcriptAssets[transcriptAssets.length - 1].endTime;