var fs      = require('fs-extra');
var path    = require('path');
var webfont = require('webfont-ex').default
var config  = require('config');

// node-glob

var target = path.join(process.cwd(), config.spalate.webfont.target);
var output = path.join(process.cwd(), config.spalate.webfont.output);

async function run() {
  await fs.remove(output)
  await fs.mkdirs(output + '/_temp');
  await fs.copy(target, output + '/_temp');
  
  webfont({
    files: output + '/_temp/*.svg',
    fontName: 'iconfont',
    prependUnicode: true,
    startUnicode: 0xF001,
    template: "css",
    cssTemplateClassName: 'icon',
    cssTemplateFontName: 'iconfont',
    // normalize: true,
    // fontHeight: 512,
  }).then((result) => {
    fs.writeFileSync(output + '/iconfont.ttf', result.ttf )
    fs.writeFileSync(output + '/iconfont.woff', result.woff )
    fs.writeFileSync(output + '/iconfont.woff2', result.woff2 )
    fs.writeFileSync(output + '/iconfont.css', result.styles)
    console.log(result);
  });  
};

run();


