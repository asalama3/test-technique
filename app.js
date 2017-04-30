const fs = require('file-system');
const htmlparser = require('htmlparser2');
const util = require('util');

/* fonction pour récupérer le prix total des billets (key: price) */
const totalPrice = (text) => {
  const regex = new RegExp('([A-Z-a-z ]+[\:])\\s\\d+[\,]\\d+', 'g');
  const matches = regex.exec(text);
  if (!matches) return null;
  const price = matches[0].split('\n');
  const newPrice = price[1].replace(',', '.');
  return newPrice;
}

/* fonction pour récupérer le nom associé aux billets de train */
const findName = (ref, text) => {
  const regex = new RegExp(ref + '[a-z]{3,30}');
  const matches = regex.exec(text);
  if (!matches) return null;
  const result = matches[0].split(':')
  const name = result[1].split('\n');
  return name[1];
}

/* fonction pour récupérer la référence du dossier */
const findCode = (ref, text) => {
  const regex = new RegExp(ref + '([A-Z0-9]+)');
  const matches = regex.exec(text);
  if (!matches) return null;
  return matches[1];
}

/* fonction pour organiser les données de la fonction findRoundTrips */
const tripsData = (contents) => {
  let result = '';
  result = contents.map((src, key) => {
    let object = {};
    let infos = src.split('\n');
    const date = new Date(infos[0]);
    object.type = infos[1];
    object.date = date;
    const data = {};
    object.trains = [];
    data.departureTime = infos[2].replace('h', ':');
    data.departureStation = infos[3];
    data.arrivalTime = infos[7].replace('h', ':');
    data.arrivalStation = infos[8];
    data.type = infos[4];
    data.number = infos[5];
    object.trains.push(data);
    return object;
  });
  return result;
}

/* fonction pour récuperer les infos des billets (key: roundTrips) */
const findRoundTrips = (text) => {
  const regex = new RegExp('([a-z-A-Z]+\\s\\d+\\s[a-z-A-Z]+)\\s(Aller|Retour)\\s(\\d{2}(h)\\d{2})\\s([A-Z ]+)\\s([A-Z]+)\\s(\\d{4})\\s([\\w]+)\\s([a-z ]+)\\s(\\d{2}(h)\\d{2})\\s([A-Z ]+)\\s([A-Z]+)\\s([\\w]+)', 'g');
  const matches = text.match(regex);
  const tickets = [ matches[0], matches[1], matches[2], matches[3] ];
  return tickets;
}

/* fonction pour récupérer les prix de chaque billet */
const getCustom = (text) => {
  const regex = new RegExp('(passagers|Carte Enfant\\+)\\s(\\d+[\,]\\d+)', 'g');
  const matches = text.match(regex);
  const firstPrice = matches[0].split('\n')[1].replace(',', '.');
  const secondPrice = parseFloat(matches[1].split('\n')[1]).toFixed(0);
  const thirdPrice = parseFloat(matches[2].split('\n')[1]).toFixed(0);
  const allPrices = {};
  const tab = [];
  tab.push({ value: firstPrice });
  tab.push({ value: secondPrice });
  tab.push({ value: thirdPrice });
  return tab;
}

/* fonction qui récupère toutes les données nécessaires pour faire le json */
const extractData = (content) => {
  const price = totalPrice(content);
  const name = findName('Nom\nassocié\n:\n', content);
  const code = findCode('Référence\nde\ndossier\n:\n', content);
  const roundTrips = tripsData(findRoundTrips(content));
  const custom = getCustom(content);
  let dataObj = {};
  dataObj.status = "ok";
  dataObj.result = {};
  dataObj.result.trips = [{}];
  dataObj.result.custom = {};
  dataObj.result.custom.prices = custom;
  dataObj.result.trips[0].code = code;
  dataObj.result.trips[0].name = name;
  dataObj.result.trips[0].details = {};
  dataObj.result.trips[0].details.price = price;
  dataObj.result.trips[0].details.roundTrips = roundTrips;
  console.log(util.inspect(dataObj, { showHidden: false, depth: null }));
}

/* parsing du html en text */
const parseHTMLFile = (html) => {
  let content = '';
  const parser = new htmlparser.Parser({
    ontext: (text) => {
        text = text.trim();
        if (!text || text === '\\r\\n') return ;
        content += text + '\n';
    },
  }, { decodeEntities: true });
  parser.write(html);
  parser.end();
  return content;
}

/* lecture du fichier html */
const readHTMLFile = (path) => {
  try {
    const html = fs.readFileSync(path, 'utf8');
    extractData(parseHTMLFile(html));
  } catch (e) {
    console.error(e);
    process.exit();
  }
}

/* gestion d'erreurs */
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
