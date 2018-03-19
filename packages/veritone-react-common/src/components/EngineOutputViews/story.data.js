export const transcriptAssets = [
  {
    startTimeMs: 0,
    endTimeMs: 13812,
    sourceEngineId: "67cd4dd0-2f75-445d-a6f0-2f297d6cd182",
    sourceEngineName: "Temporal",
    taskId: "e1fa7d7c-6f1c-480e-b181-68940509f070-4fba913a-7fc0-4dbe-9eae-df5892c10683",
    series: [
      {
        start: 0,
        end: 13130,
        text: "I have a dream . That 1 day . This nation will rise up . And live out the true meaning of its screen . We hold these truths to be self-evident that all men are created equal ."
      },
      {
        start: 13131,
        end: 13146,
        text: "Hello I am just typing some random stuff to show how "
      },
      {
        start: 13147,
        end: 13162,
        text: "we can display a transcript using"
      },
      {
        start: 13163,
        end: 13170,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        start: 13171,
        end: 13176,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        start: 13177,
        end: 13182,
        text: "Just a random string for dummy data that I made up. "
      }
    ]
  },
  {
    startTimeMs:13183,
    endTimeMs: 13236,
    sourceEngineId: "67cd4dd0-2f75-445d-a6f0-2f297d6cd182",
    sourceEngineName: "Temporal",
    taskId: "e1fa7d7c-6f1c-480e-b181-68940509f070-1e5e61a6-ad67-4116-a810-73aaad01353a",
    series: [
      {
        start: 13183,
        end: 13188,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        start: 13189,
        end: 13194,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        start: 13195,
        end: 13200,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        start: 13201,
        end: 13206,
        text: "Hello I a m just typing some random stuff to show how "
      },
      {
        start: 13207,
        end: 13212,
        text: "we can display a transcript using"
      },
      {
        start: 13213,
        end: 13218,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        start: 13219,
        end: 13224,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        start: 13225,
        end: 13230,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        start: 13231,
        end: 13236,
        text: "Just a random string for dummy data that I made up. "
      },
    ]
  },
  {
    startTimeMs: 13237,
    endTimeMs: 13292,
    sourceEngineId: "67cd4dd0-2f75-445d-a6f0-2f297d6cd182",
    sourceEngineName: "Temporal",
    taskId: "e1fa7d7c-6f1c-480e-b181-68940509f070-fef496da-f36e-49ec-a304-426d96017ddf",
    series: [
      {
        start: 13237,
        end: 13242,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        start: 13243,
        end: 13248,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        start: 13249,
        end: 13250,
        text: "Hello I am just typing some random stuff to show how "
      },
      {
        start: 13251,
        end: 13256,
        text: "we can display a transcript using"
      },
      {
        start: 13257,
        end: 13262,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        start: 13263,
        end: 13268,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        start: 13269,
        end: 13274,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        start: 13275,
        end: 13280,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        start: 13281,
        end: 13286,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        start: 13287,
        end: 13292,
        text: "Just a random string for dummy data that I made up. "
      },
    ]
  }
];

export const tdoStartTime = transcriptAssets[0].startTime;
export const tdoEndTime = transcriptAssets[transcriptAssets.length - 1].endTime;

export const sentimentAssets = [
  {end: 5580, score: 0.6, start: 80},
  {end: 10599, score: 0.75, start: 5589},
  {end: 16340, score: 0.55, start: 10610},
  {end: 18130, score: 0.65, start: 16350},
  {end: 23610, score: 0.45, start: 18110},
  {end: 24010, score: 0.25, start: 23620},
  {end: 29010, score: 0.45, start: 24020},
  {end: 34150, score: 0.75, start: 29022}
];

export const objectDetectionAssets = [
  {
    startTimeMs: 0,
    endTimeMs: 9000,
    sourceEngineId: "2dc5166f-c0ad-4d84-8a85-515c42b5d357",
    sourceEngineName: "Google Cloud Video Intelligence - Label Detection",
    taskId: "e1fa7d7c-6f1c-480e-b181-68940509f070-fef496da-f36e-49ec-a304-426d96017ddf",
    series: [
      {
        startTimeMs: 0,
        endTimeMs: 1000,
        object: {
          label: "data",
          confidence: 0.942457377910614
        }
      },
      {
        endTimeMs: 1000,
        startTimeMs: 0,
        objects: {
          label: "science",
          confidence: 0.8848179578781128
        }
      },
      {
        endTimeMs: 2000,
        startTimeMs: 0,
        object: {
          label: "data",
          confidence: 0.942457377910614
        }
      },
      {
        endTimeMs: 2000,
        startTimeMs: 0,
        object: {
          label: "desktop",
          confidence: 0.8710343837738037
        }
      },
      {
        endTimeMs: 4000,
        startTimeMs: 0,
        object: {
          label: "data",
          confidence: 0.8665211200714111
        }
      },
      {
        endTimeMs: 5000,
        startTimeMs: 0,
        object: {
          label: "data",
          confidence: 0.899578332901001
        }
      },
      {
        endTimeMs: 9000,
        startTimeMs: 0,
        object: {
          label: "desktop",
          confidence: 0.9239837527275085
        }
      }
    ]
  }
];

export const ocrAssets = [
  {
    startTimeMs: 0,
    endTimeMs: 22000,
    sourceEngineId: "9a6ac62d-a881-8884-6ee0-f15ab84fcbe2",
    sourceEngineName: "Cortex",
    taskId: "23969da8-c532-46ae-b4cf-b002d44b31ce-82e4453e-b1a9-425f-8b5c-488915939bac",
    series: [
      {
        "end": 1000,
        "start": 0,
        "object": {
          "text": "WITH \n DEVELOPING NOW \n TED CRUZ GAINING IN POLLS AND FUND-RAISING CNN \n Sara Murray CNW Political Reporter \n LIVE \n NAS58.43 \n AONY ON CHAMPS-ELYSEES, MAYOR SAYS \n U.S. TIGHTENING SECURITY I SITUATION ROOM \n "
        }
      },
      {
        "end": 2000,
        "start": 1000,
        "object": {
          "text": "WITH \n DEVELOPING NOW \n TED CRUZ GAINING IN POLLS AND FUND-RAISING CNN \n Sara Murray CNW Political Reporter \n LIVE \n NAS -58.43 \n IONY ON CHAMPS-ELYSEES, MAYOR SAYS \n U.S. TIGHTENING SECURITY It SITUATION ROOM \n "
        }
      },
      {
        "end": 3000,
        "start": 2000,
        "object": {
          "text": "WITH \n DEVELOPING NOW \n TED CRUZ GAINING IN POLLS AND FUND-RAISINGN \n Sara Murray CNW Political Reporter \n LIVE \n NAS58.43 \n I CHAMPS-ELYSEES, MAYOR SAYS \n U.S. TIGHTENING SECURITY IN HIGH-F sTUATION ROOM \n "
        }
      },
      {
        "end": 4000,
        "start": 3000,
        "object": {
          "text": "THE WITH \n DEVELOPING NOW \n TED CRUZ GAINING IN POLLS AND FUND-RAISING CNN \n Sara Murray CW Political Reporter \n LIVE \n NAS58.43 \n ELYSEES, MAYOR SAYS \n U.S. TIGHTENING SECURTY IN HIGH-PROFILE L SITUATION ROOM \n "
        }
      },
      {
        "end": 5000,
        "start": 4000,
        "object": {
          "text": "THE WITH \n DEVELOPING NOW \n LIVE \n TED CRUZ GAINING IN POLLS AND FUND-RAISING CNN \n Sara Murray \n MAYOR SAYS \n CNW Political Reporter \n NASS8.43 \n U.S. TIGHTENING SECURITY IN HIGH-PROFILE LOCATIONS SITUATION ROOM \n "
        }
      }
    ]
  }
]