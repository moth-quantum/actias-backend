# Q1Synth v2.0
This app was built with Svelte Kit. It is intended to work as both an application for the browser and as an executable desktop application for Mac OS, Linux and Windows. We refer to these two versions as `website` and `app`, respectively. The app code can be found in the [q1synth-electron](https://github.com/lunar-build/q1synth2-electron/) repository. See the README for how to view, develop, bundle and distribute the app.

## How this works
This repository can be viewed in both the website or app contexts to facilitate concurrent development of the two. When serving a local version of this codebase, if viewed in a browser, you are seeing the website, when viewed in the electron 'shell' you are seeing the app. Use the `isApp()` function, found in src/stores/global.ts, whenever you need to conditionally vary the behaviour / appearance of the application, depending on the context. `isApp` is always true when viewed inside Electron and false when viewed in a browser.

## Local development
* Download this repository
* nvm use
* yarn install
* install repos found in .gitsubmodules
* yarn dev
* yarn build

## Hosting
The website is currently hosted on Moth's Netlify account, at the following domains:
* production -> https://q1synth.mothquantum.com/
* staging -> https://q1synth-uat.mothquantum.com/
