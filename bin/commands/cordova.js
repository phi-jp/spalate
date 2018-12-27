const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const config  = require('config').spalate.cordova;
const xml2js = require('xml2js');
const colors = require('colors');

const pathToCofigXml = config.target + '/config.xml';
let appVersion = '';

(async () => {

  // ファイルとパスの存在チェックをしつつパースする
  let xmlParseResult;
  try {
    xmlParseResult = await getXmlParseResult();
  }
  catch(err) {
    return errorLog(err);
  }

  // パースしたファイルから アプリの version を取得
  appVersion = xmlParseResult.widget['$'].version;
  
  // プラットフォームごとにファイルをコピーする
  config.platforms.forEach(platform => {
    copyToPlatformFolder(platform);
  });

})();


// 以下関数

// xml ファイルをパースした結果を取得する
async function getXmlParseResult() {
  // Config ファイルに input 先が明記されているか
  if (!config.target)  {
    throw(" Cannot find the path of target. Please checking defulat.yml or production.yml");
  }
  // Config ファイルに output 先が明記されているか
  if (!config.output) {
    throw(" Cannot find the path of output. Please checking defulat.yml or production.yml");
  }

  // config.xml があるかどうかチェック
  let exists = await fse.pathExists(pathToCofigXml);
  if (!exists) {
    throw(" Cannot find config.xml. Please check below directory \n" + "　→　" + pathToCofigXml);
  }

  // xml を パース
  const xmlResult = await readFileFromConfigXml(pathToCofigXml).catch(err => {
    throw(" Cannot read or parse file from config xml \n");
  });

  return xmlResult;
};

// pathにおいてあるxmlファイルを読み込む
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

// プラットフォームごとにコピーする
async function copyToPlatformFolder(platform) {

  // コピースタートを宣言
  console.log( '    Copying ' + platform + ' ...')
  
  let targetPlatform = config.target + '/platforms/' + platform;

  // Cordova プロジェクト配下に プラットフォームがあるかどうか
  let exists = await fse.pathExists(targetPlatform);
  if (!exists) {
    return console.log(' ✗  '.red + "Cannot find " + platform + " folder on platforms directry. Please checking platforms directory\n" + "　→　" + targetPlatform);
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

// error のログを吐き出す
function errorLog(message) {
  console.error(" ✗  Error: ".red + message);
};


