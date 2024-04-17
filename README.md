# Q1Synth v2.0
This app was built with Svelte Kit. It is intended to work as both an application for the browser and as an executable desktop application for Mac OS, Linux and Windows. We refer to these two versions as `website` and `app`, respectively. The app code can be found in the [q1synth-electron](https://github.com/lunar-build/q1synth2-electron/) repository. See the README for how to view, develop, bundle and distribute the app.

## How this works
This repository can be viewed in both the website or app contexts to facilitate concurrent development of the two. When serving a local version of this codebase, if viewed in a browser, you are seeing the website, when viewed in the electron 'shell' you are seeing the app. Use the `isApp()` function, found in src/stores/global.ts, whenever you need to conditionally vary the behaviour / appearance of the application, depending on the context. `isApp` is always true when viewed inside Electron and false when viewed in a browser.

## Local development
* nvm use
* yarn install
* yarn run dev
* yarn run build

## Hosting
The website is currently hosted on Moth's Netlify account, at the following domains:
* production -> https://q1synth.mothquantum.com/
* staging -> https://q1synth-uat.mothquantum.com/

## Custom samples
Custom samples can only be used with a local version of the synth
* create `custom-samples` directory in `static/samples`
* .gitignore `custom-samples`
* drag audio files or folders of audio files into `static/samples`. You can have 32 max and file names should not contain spaces.
* run `yarn samples` to generate `samples.json` file
* for now, you need to paste the contents of `samples.json` into the writeable store at `src/lib/stores/samples.ts`
* run `yarn dev` to spin up local version of site with access to local samples

### Ignored files
So that using custom samples doesn't disrupt git, we have used chose to ignore future changes to the following file, using:
```bash
git update-index --skip-worktree src/lib/stores/samples.ts
```

To make changes to this file again, use:
```bash
git update-index --no-skip-worktree src/lib/stores/samples.ts
```