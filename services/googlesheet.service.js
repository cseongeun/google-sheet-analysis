const { GoogleSpreadsheet } = require('google-spreadsheet');
const { googlesheetId } = require('../config');
const { private_key, client_email } = require('../config/google.key');


const CELL_INFO = {
  BASIC_PROPERTY: 'A1:C10',
}

// [rowIndex, columnIndex]  (A5:C5)
const BASIC_PROPERTY = {
  nowBlock: [3, 1],
  endBlock: [4, 1],
}

const accessSheet = async () => {
  const doc = new GoogleSpreadsheet(googlesheetId);
  await doc.useServiceAccountAuth({
    client_email,
    private_key,
  });
  await doc.loadInfo();
  return doc; 
}

const existedSheet = async (title) => {
  const doc = await accessSheet();
  const sheet = await doc.sheetsByTitle[title];
  if (sheet === undefined) { 
    return false;
  } 
  return true;  
} 

const createSheet = async (title) => {
  const doc = await accessSheet();
  const newSheet = await doc.addSheet({ title });
  return newSheet;
} 

// position [rowIndex, columnIndex]
const updateCell = async (title, position, value) => {
  const doc = await accessSheet();
  const sheet = await doc.sheetsByTitle[title];

  await sheet.loadCells(CELL_INFO.BASIC_PROPERTY);

  const cell = await sheet.getCell(position[0], position[1]);
  cell.value = value;
  cell.textFormat = { bold: true };
  await sheet.saveUpdatedCells();

}

const createSheetInitScan = async (title, startBlock, endBlock) => {
  const sheet = await createSheet(title);
  
  await sheet = loadCells(CELL_INFO.BASIC_PROPERTY);
  const cell = await sheet.getCell(posi)


}


module.exports = {
  existedSheet,
  createSheet,
  createSheetInitScan,
  updateCell
}