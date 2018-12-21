const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const config  = require('config').spalate.cordova;
const xml2js = require('xml2js');
const colors = require('colors');

const pathToCofigXml = config.target + '/config.xml';
let appVersion = '';

(async () => {
  // config.xml があるかどうかチェック
  let exists = await fse.pathExists(pathToCofigXml);
  if (!exists) {
    console.log(' ✗  Error: '.red + "Cannot find config.xml. Please check below directory \n" + "　→　" + pathToCofigXml);
    return;
  }

  // xml を パース
  const xmlResult = await readFileFromConfigXml(pathToCofigXml).catch(err => {
    console.log(" ✗  Error: ".red + "Cannot read or parse file from config xml \n" + err);
    return;
  });

  // パースしたファイルから アプリの version を取得
  appVersion = xmlResult.widget['$'].version;
  
  // プラットフォームごとにファイルをコピーする
  config.platforms.forEach(platform => {
    copyToPlatformFolder(platform);
  });

})();


// 以下関数
function readFileFromConfigXml(path) {
  return new Promise((resolve, reject) => {

    // console.log('read file from config.xml ...');
    fs.readFile(path, (err, data) => {
      if (err !== null) {
        reject(err);
      }
      let parser = new xml2js.Parser();

      // console.log('parse xml from config.xml ...');
      parser.parseString(data, (err, result) => {

        if (err !== null) {
          reject(err);
        }
        console.log(' ✓  '.green + 'Read & Parse file from config.xml');
        resolve(result);
      });
    });
  });
};

async function copyToPlatformFolder(platform) {

  // コピースタートを宣言
  console.log( '    Copying ' + platform + ' ...')

  // Config ファイルに input output 先が明記されているか
  if (!config.target || !config.output)  {
    return console.error("Error: ".red + ": could't find the path target or output");
  }
  
  let targetPlatform = config.target + '/platforms/' + platform;

  // Cordova プロジェクト配下に プラットフォームがあるかどうか
  let exists = await fse.pathExists(targetPlatform);
  if (!exists) {
    return console.log(' ✗  '.red + "Cannot find " + platform + " folder on application directry. Please checking application directory\n" + "　→　" + targetPlatform);
  }
  
  // コピー先とコピー元を指定
  let targetPath = targetPlatform + '/platform_www/';
  let output = config.output + '/' + platform + '/' + appVersion;

  // Copy 実行
  try {
    await fse.copy(targetPath , output);
    console.log(' ✓  '.green + 'Success copying!: ' + platform);
  }
  catch(err) {
    console.error(' ✗  '.red + err);
  }
};



