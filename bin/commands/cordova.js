const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const config  = require('config').spalate.cordova;
const xml2js = require('xml2js');
const colors = require('colors');

const pathToCofigXml = config.target + '/config.xml';

let appVersion = '';


(async () => {

  // xml を パース
  const xmlResult = await readFileFromConfigXml(pathToCofigXml).catch(err => {
    console.log("Err! Could't read or parse file from config xml \n".red + err);
  });

  // パースしたファイルから アプリの version を取得
  appVersion = xmlResult.widget['$'].version;
  
  // プラットフォームごとにファイルをコピーする
  config.platforms.forEach(platform => {
    copyToPlatformFolder(platform);
  });

})();



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
        console.log('✓  '.green + 'Read & Parse file from config.xml');
        resolve(result);
      });
    });
  });
};

async function copyToPlatformFolder(platform) {

  // コピースタートを宣言
  console.log( 'Copying ' + platform + ' ...')

  // Config ファイルに input output 先が明記されているか
  if (!config.target || !config.output)  {
    return console.error("Error".red + ": could't find the path target or output");
  }
  var targetPath = config.target + '/platforms/' + platform + '/platform_www';

  // Cordova プロジェクト配下に プラットフォームがあるかどうか
  let exists = await fse.pathExists(targetPath);
  if (!exists) {
    return console.log('✗  '.red + "Cannot find " + platform + " folder on app directry. Please checking directory")
  }
  
  let output = config.output + '/' + platform + '/' + appVersion;

  // Copy 実行
  try {
    await fse.copy(targetPath, output);
    console.log('✓  '.green + platform +": Success copying!");
  }
  catch(err) {
    console.error('✗  '.red + err);
  }
};



