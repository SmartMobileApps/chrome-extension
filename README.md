## Yuno Chrome Extension

Built using [https://github.com/yeoman/generator-chrome-extension](https://github.com/yeoman/generator-chrome-extension)

* Run `grunt debug` to start the live reload server
* Run `grunt build` to minify and make the app production ready
* `app/scripts/options.js` will have the `js` code when `options.html` is triggered.
* `app/scripts/background.js` has the code for the context menu. 
* Our RESTManager is located at `libs/RESTManager.js` and it is referred in `manifest.json`

> Please wire the js files as per your convenience.

* If you do not want `livereload`, remove `"scripts/chromereload.js"` from `app/manifest.json`.

* Also, the string used are externalized. Refer `app/_locales` folder.
