# Greek Conjugator

Finds the conjugation of Ancient Greek verbs.

## Sources

The conjugations are built on the Greek verb conjugations entered by users in [Wiktionary](https://en.wiktionary.org/wiki/Category:Ancient_Greek_verbs).

## Try it Out

[https://apps.perseids.org/greek-conjugator/](https://apps.perseids.org/greek-conjugator/)

### How to Use

Type a word in the input box and you should see the conjugation(s) appear below.

## Installation

`yarn install`

## Updating the conjugations

```
cd scripts/
ruby crawler.rb
ruby parser.rb
cp *.json ../src/dictionaries/
```

## Running the development server

`yarn start`

## Building for deployment

Before creating a production build you need to know the path where it will be accessed.
Then run the command `PUBLIC_URL='./path/of/app' yarn build`.
This will generate a set of static files in the `build/` directory that you can serve.

For example, if you want to deploy it at `www.example.com/` then run `PUBLIC_URL='./' yarn build`.
If you want to deploy it at `www.example.com/lexica/conjugator` then run
`PUBLIC_URL='./lexica/conjugator' yarn build`.

## Running tests

`yarn test`

## Linting the code

`yarn lint`

## Deploying a new version to github.io

`yarn deploy-github`

## Deploying a new version to Perseids

`yarn deploy-perseids`
