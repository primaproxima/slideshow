# slideshow
Based on reveal.js

All slides should be placed in the /content directory under a specific directory which is master for that slideshow.

The content of each slide should be enclosed with `<section></section>`. Having more than 1 `<section></section>` per .html will result in visually separate slides, navigable with the -> right arrow.

Nesting `<section></section>` will produce vertically positioned slides. More on this can be found at the [reveal.js docs](https://revealjs.com/#/).

The slides can be written in plain html or markdown. [See for more](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

## Build and run
Once you are happy with the content of your slides, the slideshow should be tested.

### Prepare the project
First, build the project itself by running `yarn` or `npm install` in the root of the project.

### Build the slideshow
Build the slideshow by running `grunt` or `grunt build` or `npm run build`. Running any of these will create a /dist folder which is mostly a copy paste of the original files, but easily maintainable.
This will, however, build the default slideshow, found in the /default directory.

To build your slideshow, pass in the grunt option `slidesPath` pointing to the absolute path of the slideshow and pass in the grunt option `slidesTitle` to have a nice html title in the browser.

`grunt build --slidesPath='./content/heapcon2018' --slidesTitle='Heapcon 2018`
or
`npm run build -- --slidesPath='./content/heapcon2018' --slidesTitle='Heapcon 2018`

### Run the slideshow
Running `npm start` will serve your slideshow on port 8080. See the npm script for details.

Enjoy your faboulous slides.
