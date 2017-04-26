var fs = require('file-system');
var htmlparser = require('html-parser');
// read file
// parse each data in html
// use regex
// push dans l'objectResult all info from html - json.stringify?


objectResult = {
  status: "",
  result: {
    trips: [
      {
        code: "",
        name: "",
        details: {
          price: "",
          roundTrips: [
            {
              type: "",
              date: "",
              trains: [],
            }
          ]
        }
      }
    ]
    // custom: {
      // price: [],
    // }
  }
}

module.exports.init = () => {
  console.log('hi');
};

module.exports.parseFile = () => {
  console.log('parse file');

}


module.exports.readHTMLFile = (req, res) => {
  console.log('---------------------------');
  const html = fs.readFileSync('./test.html');
  console.log('reading file', html);
  module.exports.parseFile(html);
  // fs.readFileSync('./test.html', (html, err) => {
  //   console.log('read file');
  //   if (err) throw err;
  //   if (html) {
  //     console.log('ok ca marche', html);
  //   }
  // })
  // const args = process.argv;
  // console.log(args);
}
