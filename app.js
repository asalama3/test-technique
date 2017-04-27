const fs = require('file-system');
const htmlparser = require('htmlparser');
// const sys = require('sys');
const util = require('util');

/* STEPS
    read HTML file
    parse file - htmlparser -> objet JS
    parcourir l'objet et recuperer data
    creer objet dynamiquement au fur et a mesure
*/

const extractData = (data) => {
  console.log('----------EXTRACT DATA------------------');
  // console.log(util.inspect(data, false, null));
  // const obj = util.inspect(data, false, null);
  // console.log(obj);
  console.log(data[2].children);


}

const parseHTMLFile = (html) => {
  console.log('----------PARSE FILE--------------------');
  const handler = new htmlparser.DefaultHandler((err, dom) => {
    if (err) throw err;
  }, { verbose: false, ignoreWhitespace: true });
  const parser = new htmlparser.Parser(handler);
  parser.parseComplete(html);
  // console.log(util.inspect(handler.dom, false, null));
  // console.log(handler.dom);
  extractData(handler.dom);
}

const readHTMLFile = (path) => {
  console.log('----------READ HTML FILE----------------');
  try {
    const html = fs.readFileSync(path, 'utf8');
    // console.log('reading file', html);
    parseHTMLFile(html);
  } catch (e) {
    console.error(e);
    process.exit();
  }
  // const args = process.argv;
  // console.log(args);
}

if (
  !process.argv ||
  process.argv.length < 3 ||
  process.argv.length >= 4 ||
  !process.argv[2]
) {
  console.error('filename required');
  process.exit();
}

readHTMLFile(process.argv[2]);
