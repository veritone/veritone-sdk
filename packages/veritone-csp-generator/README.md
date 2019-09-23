# Veritone CSP Generator

## Background

This package exports functions that help you generate a query to core-search-server from a Cognitive Search Profile. A CSP is a structured JSON document that describes what you are looking for across multiple engine categories.

Every engine category has its own data structure for describing "what" you are looking for. By joining together the engine category data structures with a CSP, we can describe
how to find data across multiple cognitive engines using boolean logic.

## Use

For the most part, you will not write CSPs by hand. Instead, we recommend that you use the
veritone-searchbar (WIP), which is a React component that provides a graphical user interface for each engine category. It will progressively generate a CSP as you enter search criteria.

Once you have a CSP, you can use the `CSPtoV3Query` function exported by this package, to generate a V3 core-search-query. For convenience, the CSPtoV3Query automatically includes any processing jobs or media processed by Veritone.

```
  const csp = {
    and: [
      {
        state: {
          language: 'en',
          search: '"Kobe Bryant"'
        },
        engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
      }
    ]
  };

  console.log(JSON.stringify(CSPtoV3Query(csp)));


  > {
   "query":{
      "operator":"and",
      "conditions":[
         {
            "operator":"and",
            "conditions":[
               {
                  "operator":"query_string",
                  "field":"transcript.transcript",
                  "value":"\"kobe bryant\""
               }
            ]
         }
      ]
   },
   "select":[
      "veritone-job",
      "veritone-file",
      "transcript"
   ]
}
```

This CSP would search any processing jobs or files processed by Veritone where `"Kobe Bryant"` occurs in the text transcription.

## Build

This modules uses ES6 imports. Run `yarn build` to generate CommonJS and ES6 bundles.

# License

Copyright 2019, Veritone Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
