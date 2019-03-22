# Woodhouse JS

This is the entire *English-Greek Dictionary: A Vocabulary of the Attic Language* by S. C. Woodhouse in JavaScript.
You should be able to use this web app with or without internet access after you load it once.

## Sources

The Woodhouse text used is based on

* [http://www.textkit.com/greek-latin-forum/viewtopic.php?t=62713](http://www.textkit.com/greek-latin-forum/viewtopic.php?t=62713)
* [https://archive.org/details/Woodhouse\_201805](https://archive.org/details/Woodhouse_201805)
* [https://www.lib.uchicago.edu/efts/Woodhouse/](https://www.lib.uchicago.edu/efts/Woodhouse/)

## Try it Out

[https://apps.perseids.org/woodhouse/](https://apps.perseids.org/woodhouse/)

### How to Use

Type a word in the input box and you should see the definition(s) appear below.

## Installation

`yarn install`

## Updating the dictionary

Update the file `vendor/woodhouse.json` with any changes then run `yarn run build-dictionary`.

## Running the development server

`yarn start`

## Building for deployment

Before creating a production build you need to know the path where it will be accessed.
Then run the command `PUBLIC_URL='./path/of/app' yarn build`.
This will generate a set of static files in the `build/` directory that you can serve.

For example, if you want to deploy it at `www.example.com/` then run `PUBLIC_URL='./' yarn build`.
If you want to deploy it at `www.example.com/lexica/woodhouse` then run
`PUBLIC_URL='./lexica/woodhouse' yarn build`.

## Running tests

`yarn test`

## Linting the code

`yarn lint`

## Deploying a new version to github.io

`yarn deploy-github`

## Deploying a new version to Perseids

`yarn deploy-perseids`
