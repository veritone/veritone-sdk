import { VALIDATORS, verifyObject, verifyTranscript } from './index';
import _ from 'lodash';

import glob from 'glob';

const validationContracts = {};

// dynamically import all json files in examples or invalid-examples
const files = glob.sync(
  'schemas/vtn-standard/**/**(examples|invalid-examples)/!(master.json)//*.json'
);
for (let file of files) {
  const validationContractIndex =
    file.split('/').findIndex(directory => _.includes(directory, 'examples')) -
    1;
  const validationContract = file.split('/')[validationContractIndex];
  let directory = file.split('/');
  let fileName = directory.pop();
  directory = directory.join('/');
  const test = { directory, fileName };

  if (validationContract in validationContracts) {
    validationContracts[validationContract].push(test);
  } else {
    validationContracts[validationContract] = [test];
  }
}

Object.keys(validationContracts).forEach(validationContract => {
  describe(`"${validationContract}" tests`, () => {
    const validator = VALIDATORS[validationContract];
    if (typeof validator === 'function') {
      for (let test of validationContracts[validationContract]) {
        if (_.includes(test.directory, 'invalid')) {
          // JSON files in invalid-examples should not validate
          it(`should NOT validate ${test.directory}/${
            test.fileName
          }`, async () => {
            const json = await import(`../${test.directory}/${test.fileName}`);
            const invalidResult = validator(json);
            expect(invalidResult).not.toHaveProperty('valid');
            expect(invalidResult.errors).not.toBeNull();
            expect(invalidResult.errors).not.toBeUndefined();
            expect(invalidResult.errors.length).toBeGreaterThan(0);
          });
        } else {
          // JSON files in examples should validate
          it(`should validate ${test.directory}/${test.fileName}`, async () => {
            const json = await import(`../${test.directory}/${test.fileName}`);
            const validResult = validator(json);
            expect(validResult).toHaveProperty('valid');
            expect(validResult.processed).not.toBeNull();
            expect(validResult.processed).not.toBeUndefined();
          });
        }
      }
    } else {
      console.warn(
        `No validator for validationContract: ${validationContract}`
      );
    }
  });
});

test('it should export a transcript validator', () => {
  expect(VALIDATORS['transcript']).toEqual(verifyTranscript);
  expect(verifyTranscript).not.toBeUndefined();
  expect(verifyTranscript).not.toBeNull();
});

test('it should invalidate an object with extra properties in the summary object array', () => {
  const objectSummaryWithTimeFields = {
    schemaId: 'https://docs.veritone.com/schemas/vtn-standard/object.json',
    validationContracts: ['object'],
    object: [
      {
        type: 'object',
        label: 'dog',
        confidence: 0.9,
        boundingPoly: [
          {
            x: 0.1,
            y: 0.1
          },
          {
            x: 0.1,
            y: 0.5
          },
          {
            x: 0.5,
            y: 0.5
          },
          {
            x: 0.5,
            y: 0.1
          }
        ],
        startTimeMs: 0,
        stopTimeMs: 2200
      }
    ]
  };

  const results = verifyObject(objectSummaryWithTimeFields);
  expect(results.valid).not.toBe(true);
  expect(results.errors.length).toBe(2);
});

test('it should invalidate an object with extra properties in the objectCategory', () => {
  const objectWithExtraFields = {
    schemaId: 'https://docs.veritone.com/schemas/vtn-standard/object.json',
    validationContracts: ['object'],
    object: [
      {
        type: 'object',
        label: 'dog',
        confidence: 0.9,
        boundingPoly: [
          {
            x: 0.1,
            y: 0.1
          },
          {
            x: 0.1,
            y: 0.5,
            extra: 'should be stripped out'
          }
        ],
        objectCategory: [
          {
            class: 'animal',
            '@id': '1576',
            extra: 'should be stripped out'
          }
        ]
      },
      {
        type: 'object',
        label: 'cat',
        extra: 'should be stripped out',
        confidence: 0.55,
        objectCategory: [
          {
            class: 'animal',
            '@id': '1576'
          }
        ]
      }
    ],
    series: [
      {
        startTimeMs: 2000,
        stopTimeMs: 2100,
        object: {
          type: 'object',
          label: 'dog',
          objectCategory: [
            {
              class: 'animal',
              '@id': '1576'
            }
          ],
          confidence: 0.9,
          boundingPoly: [
            {
              x: 0.1,
              y: 0.1
            },
            {
              x: 0.1,
              y: 0.5
            }
          ]
        }
      },
      {
        startTimeMs: 2100,
        stopTimeMs: 2200,
        object: {
          type: 'object',
          label: 'cat',
          confidence: 0.55,
          objectCategory: [
            {
              class: 'animal',
              '@id': '1576'
            }
          ]
        }
      },
      {
        startTimeMs: 1400,
        stopTimeMs: 2200,
        object: {
          type: 'object',
          label: 'ball',
          confidence: 0.55,
          objectCategory: [
            {
              class: 'toys',
              '@id': '3526',
              extra: 'should be stripped out'
            }
          ]
        }
      }
    ]
  };

  const results = verifyObject(objectWithExtraFields);
  expect(results.valid).not.toBe(true);
  // This is 5 even though there's only 4 errors in the input because
  // a duplicate additionalFields: false is double-reporting the same error.
  expect(results.errors.length).toBe(5);
});

test('it should invalidate a transcript with extra properties', () => {
  const transcriptWithExtraField = {
    schemaId: 'https://docs.veritone.com/schemas/vtn-standard/transcript.json',
    validationContracts: ['transcript'],
    series: [
      {
        startTimeMs: 0,
        stopTimeMs: 300,
        words: [
          {
            word: 'is'
          }
        ],
        extra: 'should be stripped out'
      },
      {
        startTimeMs: 300,
        stopTimeMs: 500,
        words: [
          {
            word: 'is'
          }
        ]
      },
      {
        startTimeMs: 500,
        stopTimeMs: 800,
        words: [
          {
            word: 'a',
            extra: 'should be stripped out'
          }
        ]
      },
      {
        startTimeMs: 800,
        stopTimeMs: 1200,
        words: [
          {
            word: 'sentence'
          }
        ]
      }
    ]
  };

  const results = verifyTranscript(transcriptWithExtraField);
  expect(results.valid).not.toBe(true);
  expect(results.errors.length).toBe(2);
});

// TODO: Add media-translated (and other categories)-specific tests

// TODO: Write tests for this
test('it should validate the big example json from the docs', () => {
  const sample = {
    /**
     * PREAMBLE
     * The preamble contains various high-level information for this vtn-standard document.
     */

    // Schema version to validate engine outputs against (optional)
    schemaId: 'https://docs.veritone.com/schemas/vtn-standard/master.json',

    // Denotes the engine that created it (optional, provided by Veritone)
    sourceEngineId: '<GUID>',

    // Engine name used to generate output (optional, provided by Veritone)
    sourceEngineName: 'engine_x',

    // Task payload describing the associated tasks that summon the engine (optional, provided by Veritone)
    taskPayload: {
      // "key": value pairs from the payload for this task
    },

    // The associated task (optional, provided by Veritone)
    taskId: '<TASK_ID>',

    // Date this document was generated (optional, set by Veritone if not included)
    // Format: ISO8601
    generatedDateUtc: '2017-12-08T17:19:02Z',

    // Vendor specific reference.  Used to map engine output against vendor referenced data ID (optional)
    externalSourceId: '<string>',

    // Specification for the contracts used for output validation (optional)
    // See http://docs.veritone.com/#/engines/engine_standards/capability/ for more information
    validationContracts: [
      'text',
      'face' // ...
    ],

    /**
     * OVERALL FILE DATA
     * Data in this section applies to the file being analyzed as a whole.
     * This is a commonly used section for files with no time spans like
     * images or text documents, or for expressing summary data that spans
     * the entire length of a media file.
     *
     * For data that is specific to a particular object or a particular
     * point in time inside the file, see the lower sections.
     */

    // Tags associated with this file (optional)
    // Format: { "key": "<name>", "value": "<value>" }
    // - For ground truth:  Set tag to be "groundTruth": "<provider>"
    // - For content moderation, Key must be: moderation:adult, moderation:violence, moderation:nsfw,
    //   moderation:nudity, moderation:fakeNews, moderation:pii
    // - For gender: gender[value=male|female]
    tags: [
      {
        key: 'foo',
        value: 'bar', // OPTIONAL.  If not specified, defaults to true
        score: 0.12 // OPTIONAL
      },
      {
        key: 'foo',
        value: 'bar2'
      }
    ],

    // Language Identification (optional)
    // Format: BCP-47 https://tools.ietf.org/rfc/bcp/bcp47.txt
    language: 'en-US',

    // Summary of document (optional)
    summary: '',

    // Sentiment (optional)
    // Provides a scale of how negative to positive it is
    // If a single number is returned, then positive must be used
    // Scale: 0 to 1.00 for all fields
    sentiment: {
      positiveValue: 0.12, // REQUIRED
      positiveConfidence: 0.12, // OPTIONAL
      negativeValue: 0.12, // OPTIONAL
      negativeConfidence: 0.12 // OPTIONAL
    },

    // GPS coordinates for this file (optional)
    // Format: UTM (preferred) | WGS 1984
    gps: [
      {
        latitude: 59.123,
        longitude: 213.123,
        precision: 100, //in meters
        direction: 10.1, // 0-360
        velocity: 100.0, //in meters
        altitude: 123.12 //in meters
      }
    ],

    // Emotions (optional)
    // Can be specified for whole file (here) for overall tone,
    // in an object (e.g. face recognition),
    // in series (e.g. for transcript/sentiment), or
    // in series.object (e.g. for time-specific face recognition)
    emotions: [
      {
        emotion: 'angry', // STRING: angry, happy, sad.  Can be any string field.
        emotionValue: 0.12, // OPTIONAL: How strong.  0 = none, 1.0 = 100%
        emotionConfidence: 0.88 // OPTIONAL: 0 = 0%, 1.0 = 100%
      }
    ],

    /**
     * OVERALL FILE OBJECTS
     * Data in this section applies to things (e.g. faces, objects, logos, OCR)
     * detected in the file but not in a specific time range.
     */

    // Object (Face, Object, Logo, OCR, ..) (optional)
    object: [
      {
        // Object type (REQUIRED)
        // Options:
        // - object: Object detection
        // - face: Face detection
        // - licensePlate: License plate detection
        // - logo: Logo detection
        // - speaker: Speaker recognition
        // - sound: Sound recognition
        // - concept: Concept recognition
        // - keyword: Keyword detection
        // - text: Recognized or extracted text (OCR / text extraction)
        // - namedEntity: Entity extraction
        type: 'object',

        // Main label for this object (optional)
        // REQUIRED if no other identifying information (e.g. text, entityId) is specified
        label: 'dog',

        // URI to thumbnail to show in the UI (optional)
        // If not provided but boundingPoly is provided,
        // one can be constructed dynamically from the boundingPoly.
        uri: '<URI>',

        // Entity reference (optional)
        entityId: '<GUID>',
        libraryId: '<GUID>',

        // Confidence score (optional)
        confidence: 0.99234, // 0-1

        // Text found (optional)
        // REQUIRED for OCR and text extraction
        text: 'The quick brown fox jumped over the lazy dog',

        // Document location (optional)
        // For referencing where in a document recognized text or entities or occur.
        // It is highly recommended to define at least one to ensure proper ordering for indexing.
        // For non-paginated document types like plain text files you can simply enumerate paragraphs based on line breaks.
        page: 5,
        paragraph: 3,
        sentence: 2,

        // Sentiment (optional)
        // Provides a scale of how negative to positive it is
        // If a single number is returned, then positive must be used
        // Scale: 0 to 1.00 for all fields
        sentiment: {
          positiveValue: 0.12, // REQUIRED
          positiveConfidence: 0.12, // OPTIONAL
          negativeValue: 0.12, // OPTIONAL
          negativeConfidence: 0.12 // OPTIONAL
        },

        // Emotions (optional)
        // For an object (e.g. face detection, voice analysis, text analysis) in the whole file
        emotions: [
          {
            emotion: 'angry', // STRING: angry, happy, sad.  Can be any string field.
            emotionValue: 0.12, // OPTIONAL: How strong.  0 = none, 1.0 = 100%
            emotionConfidence: 0.88 // OPTIONAL: 0 = 0%, 1.0 = 100%
          }
        ],

        // Age in years (optional)
        age: {
          min: 20,
          max: 50,
          confidence: 0.2 // 0-1
        },

        // Face landmarks (optional)
        faceLandmarks: [
          {
            type: 'mouth',

            // Ordered array of (x,y) coordinates in percentage of axis
            // Implicit line from last to first
            locationPoly: [
              {
                x: 0.1,
                y: 0.2
              }
            ]
          }
        ],

        // Object detection / keyword detection (optional)
        objectCategory: [
          {
            class: 'animal',
            '@id': 'kg:/m/0dl567',
            confidence: 0.567
          }
        ],

        // Specifies the region match was found (optional)
        // Valid values: "left", "right", "top", "bottom"
        region: 'left',

        // Bounding polygon (optional)
        // Ordered array of (x,y) coordinates in percentage of axis
        // Implicit line from last to first
        boundingPoly: [
          {
            x: 0.1,
            y: 0.2
          }
        ],

        // GPS coordinates for this object (optional)
        // Format: UTM (preferred) | WGS 1984
        gps: [
          {
            latitude: 59.123,
            longitude: 213.123,
            precision: 100, //in meters
            direction: 10.1, // 0-360
            velocity: 100.0, //in meters
            altitude: 123.12 //in meters
          }
        ],

        // Structured data values for this object (optional)
        structuredData: {
          '<schemaGuid>': {
            // GUID of the aiWARE schema ID this structured data object conforms to
            '<key>': '<value>',
            // ...
            '<keyN>': '<value>'
          }
        },

        // Custom data for this object (optional)
        // You can add any arbitrary data inside this object.
        // It will not be indexed, searchable, or have any impact on the system.
        // But it will be returned when reading the data back out.
        vendor: {
          // custom key:value pairs...
        }
      }
    ], // END OBJECT

    // Media (for linking to files when the engine's cognition results in file outputs)
    media: [
      {
        assetId: '<ID of the associated asset>',

        // Content Type (optional)
        // Must be a valid MIME type (see https://www.iana.org/assignments/media-types/media-types.xhtml)
        contentType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

        // Language Identification (optional)
        // Format: BCP-47 https://tools.ietf.org/rfc/bcp/bcp47.txt
        language: 'en'
      }
    ],

    // Custom data for this document (optional)
    // You can add any arbitrary data inside this object.
    // It will not be indexed, searchable, or have any impact on the system.
    // But it will be returned when reading the data back out.
    vendor: {},

    /**
     * TIME SERIES DATA
     * Data in this section applies to a specific time ranges within the file.
     * This is the most common section used for insights from audio and video files.
     */

    // Series (optional)
    series: [
      {
        // Start and stop times (REQUIRED)
        // Time span in milliseconds (relative to the source asset start) of this time slice
        startTimeMs: 1260,
        stopTimeMs: 1360,

        // Tags associated with this time slice (optional)
        // Format: { "key": "<name>", "value": "<value>" }
        // - For speech detected: speech=true
        // - For silence detected: silence=true
        // - For partial output: partial=true
        // - For ground truth:  Set tag to be "groundTruth": "<provider>"
        // - For content moderation, Key must be: moderation:adult, moderation:violence, moderation:nsfw,
        //   moderation:nudity, moderation:fakeNews, moderation:pii
        // - For gender: gender[value=male|female]
        tags: [
          {
            key: 'foo',
            value: 'bar', // OPTIONAL.  If not specified, defaults to true
            score: 0.12 // OPTIONAL
          },
          {
            key: 'foo',
            value: 'bar2'
          }
        ],

        // Summary of time slice (optional)
        summary: '',

        // Speaker identification (optional)
        // Example: "channel0", "speaker1", ...
        speakerId: '<Speaker Identifier>', // can be "<libraryId>:<entityId>"

        // Optional
        // Transcript (optional)
        // JSON utterance (all word edges between 2 time nodes)
        // Array of n objects describing each alternative word
        words: [
          {
            // The word spoken (required)
            word: '!silence',

            // The confidence level of the detected word spoken (optional)
            // Range should be from: 0.0 - 1.00
            confidence: 0.794,

            // Is this word included in the best path through a transcript lattice? (optional)
            bestPath: true,

            // Number of consecutive time-slices the utterance spans (optional)
            // example: of->thrones----->
            //          of->their-->own->
            // utteranceLength: thrones: 2; their,own: 1
            utteranceLength: 1
          }
        ],

        // Language Identification (optional)
        // Format: BCP-47 https://tools.ietf.org/rfc/bcp/bcp47.txt
        language: 'en-US',

        // Sentiment (optional)
        // Provides a scale of how negative to positive it is
        // If a single number is returned, then positive must be used
        // Scale: 0 to 1.00 for all fields
        sentiment: {
          positiveValue: 0.12, // REQUIRED
          positiveConfidence: 0.12, // OPTIONAL
          negativeValue: 0.12, // OPTIONAL
          negativeConfidence: 0.12 // OPTIONAL
        },

        // Emotions detected (optional)
        emotions: [
          {
            emotion: 'angry', // STRING: angry, happy, sad.  Can be any string value.
            emotionValue: 0.12, // OPTIONAL: How strong.  0 = none, 1.0 = 100%
            emotionConfidence: 0.88 // OPTIONAL: 0 = 0, 1.0 = 100%
          }
        ],

        // Entity reference (optional)
        entityId: '<GUID>',
        libraryId: '<GUID>',

        // Object (Face, Object, Logo, OCR, ..) (optional)
        object: {
          // Object type (REQUIRED)
          // Options:
          // - object: Object detection
          // - face: Face detection
          // - licensePlate: License plate detection
          // - logo: Logo detection
          // - fingerprint: Audio fingerprinting
          // - speaker: Speaker recognition
          // - sound: Sound recognition
          // - concept: Concept recognition
          // - keyword: Keyword detection
          // - text: Recognized or extracted text (OCR / text extraction)
          // - namedEntity: Entity extraction
          // - barcode
          type: 'object',

          // Main label for this object (optional)
          // REQUIRED if no other identifying information (e.g. text, entityId) is specified
          label: 'cat',

          // URI to thumbnail to show in the UI (optional)
          // If not provided but boundingPoly is provided,
          // one can be constructed dynamically from the boundingPoly.
          uri: '<URI>',

          // Entity reference (optional)
          entityId: '<GUID>',
          libraryId: '<GUID>',

          // Confidence score (optional)
          confidence: 0.99234, // 0-1

          // Text found (optional)
          // REQUIRED for OCR and text extraction
          text: 'The quick brown fox jumped over the lazy dog',

          // Emotions (optional)
          // For an object (e.g. face detection, voice analysis, text analysis) in the series
          emotions: [
            {
              emotion: 'angry', // STRING: angry, happy, sad.  Can be any string field.
              emotionValue: 0.12, // OPTIONAL: How strong.  0 = none, 1.0 = 100%
              emotionConfidence: 0.88 // OPTIONAL: 0 = 0, 1.0 = 100%
            }
          ],

          // Age in years (optional)
          age: {
            min: 20,
            max: 50,
            confidence: 0.2 // 0-1
          },

          // Face landmarks (optional)
          faceLandmarks: [
            {
              type: 'mouth',

              // Ordered array of (x,y) coordinates in percentage of axis
              // Implicit line from last to first
              locationPoly: [
                {
                  x: 0.1,
                  y: 0.2
                }
              ]
            }
          ],

          // Object detection / keyword detection (optional)
          objectCategory: [
            {
              class: 'animal',
              '@id': 'kg:/m/0dl567',
              confidence: 0.567
            }
          ],

          // Specifies the region match was found (optional)
          // Valid values: "left", "right", "top", "bottom"
          region: 'left',

          // Bounding polygon (optional)
          // Ordered array of (x,y) coordinates in percentage of axis
          // Implicit line from last to first
          boundingPoly: [
            {
              x: 0.1,
              y: 0.2
            }
          ],

          // GPS coordinates for this object (optional)
          // Format: UTM (preferred) | WGS 1984
          gps: [
            {
              latitude: 59.123,
              longitude: 213.123,
              precision: 100, //in meters
              direction: 10.1, // 0-360
              velocity: 100.0, //in meters
              altitude: 123.12 //in meters
            }
          ],

          // Structured data values for this object (optional)
          structuredData: {
            '<schemaGuid>': {
              // GUID of the aiWARE schema ID this structured data object conforms to
              '<key>': '<value>',
              // ...
              '<keyN>': '<value>'
            }
          },

          // Custom data for this object (optional)
          // You can add any arbitrary data inside this object.
          // It will not be indexed, searchable, or have any impact on the system.
          // But it will be returned when reading the data back out.
          vendor: {
            // custom key:value pairs...
          }
        }, // END OBJECT

        // GPS coordinates for this time-series entry (optional)
        // Format: UTM (preferred) | WGS 1984
        gps: [
          {
            latitude: 59.123,
            longitude: 213.123,
            precision: 100, //in meters
            direction: 10.1, // 0-360
            velocity: 100.0, //in meters
            altitude: 123.12 //in meters
          }
        ],

        // Structured data values for this time-series entry (optional)
        structuredData: {
          '<schemaGuid>': {
            // GUID of the aiWARE schema ID this structured data object conforms to
            '<key>': '<value>',
            // ...
            '<keyN>': '<value>'
          }
        },

        // Media (for linking to files when the engine's cognition results in file outputs)
        media: {
          assetId: '<ID of the associated asset>',

          // Content Type (optional)
          // Must be a valid MIME type (see https://www.iana.org/assignments/media-types/media-types.xhtml)
          contentType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

          // Language Identification (optional)
          // Format: BCP-47 https://tools.ietf.org/rfc/bcp/bcp47.txt
          language: 'en'
        },

        // Custom data for this time-series entry (optional)
        // You can add any arbitrary data inside this object.
        // It will not be indexed, searchable, or have any impact on the system.
        // But it will be returned when reading the data back out.
        vendor: {
          // custom key:value pairs...
        }
      }
    ]
  };
});
