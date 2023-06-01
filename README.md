# Q1Synth v2.0

This app was built with Svelte Kit.

## Local development
* npm install
* npm run dev
* npm run build

## Hosting
The app is currently hosted on Pete Thomas's Netlify account, at the domain:

https://q1synthv2.cephasteom.co.uk/

## Ensemble mode

Set ensemble mode to true in `src/config.js` and give yourself an id.
* npm run build
* npm run ensemble
* npm run preview

## Custom samples
Custom samples can only be used with a local version of the synth
* create `custom-samples` directory in `static/samples`
* .gitignore `custom-samples`
* drag audio files or folders of audio files into `static/samples`
* run `yarn samples` to generate `samples.json` file
* run `yarn dev` to spin up local version of site with access to local samples