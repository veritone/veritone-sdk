
# veritone-json-schemas
This repo contains all the JSON schemas besides structured data used by Veritone.

## Development
1. `yarn install` to install dependencies.
2. run `yarn test` to run the schema validator against all the examples.

## Usage
This package exports the following
```
	{
		VALIDATORS: {
		  "transcript": validateTranscript
		  "object: validateObject
          ...
        },
        validateTranscript: fn(),
        validateObject: fn(),
        ...
	}
```

which is a map of valid validation contracts to their validating functions.

## License
Copyright 2019, Veritone Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.