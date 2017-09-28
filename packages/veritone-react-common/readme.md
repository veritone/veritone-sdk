React components and related code

## Running the dev environment
`npm run storybook`: run the examples site

`npm run build:watch`: watch files and produce a new dist bundle on any changes. This is convenient when developing projects that import from veritone-react-common, as they will immediately pick up the new code through their imports.


## Troubleshooting
problems with storybook can usually be resolved by `cd`ing to the veritone-sdk root and running `yarn install --force`