const { GoogleSpreadsheet } = require('google-spreadsheet');
const { findRepos } = require('jest-changed-files');
const { googlesheetId } = require('../config');
const { private_key, client_email } = require('../config/google.key');

const SUMMARY_SHEET = 'SUMMARY';

const CELL = {
  SUMMARY: 'A1:F1000',
  TRANSACTIONS: 'E1:I1',
  TRANSACTION_COUNT_PER_ADDRESS: 'L1:M1'
}

// // [rowIndex, columnIndex]  (A5:C5)
// const PROPERTY = {
//   TRANSACTION: {
//     BLOCK_NUMBER: {
//       STR: [0, 0],
//     },
//     HASH: {
//       STR: [0, 1],
//     },
//     FROM: {
//       STR: [0, 2],
//     },
//     TO: {
//       STR: [0, 3],
//     },
//     VALUE: {
//       STR: [0, 4],
//     }
//   },
//   TRANSACTION_COUNT_PER_ADDRESS: {
//     ADDRESS: {
//       STR: [0, 7]
//     },
//     COUNT: {
//       STR: [0, 8],
//     }
//   }
// }

// const TEXT_FORMAT = {
//   bold: { bold: true },
//   italic: { italic: true },
// }

// const VALUE_TYPE = {
//   bool: 'boolValue', 
//   string: 'stringValue', 
//   number: 'numberValue', 
//   error: 'errorValue'
// }

// const HORIZONETAL_ALIGN = {
//   left: 'LEFT',
//   center: 'CENTER',
//   right: 'RIGHT'
// }
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
const updateCell = async (title, loadCell, position, value, textFormat, valueType, horizontalAlignment) => {
  const doc = await accessSheet();
  const sheet = await doc.sheetsByTitle[title];

  await sheet.loadCells(loadCell);

  const cell = await sheet.getCell(position[0], position[1]);
  cell.value = value;
  cell.textFormat = textFormat;
  cell.valueType = valueType
  cell.horizontalAlignment = horizontalAlignment
  await sheet.saveUpdatedCells();
}

const updateEndBlock = async (symbol, endBlock) => {
  await updateSummary(symbol, endBlock, true);
}

const addSummary = async (symbol, contractAddress, startBlock, endBlock) => {
  const doc = await accessSheet();
  const sheet = await doc.sheetsByTitle[SUMMARY_SHEET];

  await sheet.loadCells(CELL.SUMMARY);
  await sheet.addRow([symbol, contractAddress, startBlock, endBlock, true, new Date()])
}

const updateSummary = async (symbol, endBlock, finished) => {
  const doc = await accessSheet();
  const sheet = await doc.sheetsByTitle[SUMMARY_SHEET];

  await sheet.loadCells(CELL.SUMMARY);

  const rows = await sheet.getRows();
  const findIndex = rows.findIndex(r => r['심볼'] === symbol);

  const updateRow = rows[findIndex];
  updateRow['작업 여부'] = finished;
  updateRow['작업 목표 블록'] = endBlock;
  updateRow['날짜'] = new Date();
  await updateRow.save(); 
}

const getInfo = async (symbol) => {
  const doc = await accessSheet();
  const sheet = await doc.sheetsByTitle[SUMMARY_SHEET];

  await sheet.loadCells(CELL.SUMMARY);

  const rows = await sheet.getRows();
  const findIndex = rows.findIndex(r => r['심볼'] === symbol);

  const row = rows[findIndex];

  const contractAddress = row['컨트랙트 주소'] 
  const nowBlock = row['작업 완료 블록'];
  const endBlock = row['작업 목표 블록'];
  const finished = row['작업 여부']

  return { nowBlock, endBlock, contractAddress, finished };
}

const createSheetInitScan = async (symbol, contractAddress, startBlock, endBlock) => {
  const sheet = await createSheet(symbol);
  await sheet.setHeaderRow(['블록 높이', '트랜잭션 해시', '보낸 주소', '받는 주소', '수량', '', '', '주소', '건수'])
  await addSummary(symbol, contractAddress, startBlock, endBlock);
  // await updateCell(symbol, CELL.INFO, PROPERTY.INFO.NOW_BLOCK.VALUE, startBlock, TEXT_FORMAT.bold, VALUE_TYPE.number, HORIZONETAL_ALIGN.right);  
  // await updateCell(symbol, CELL.INFO, PROPERTY.INFO.END_BLOCK.VALUE, endBlock, TEXT_FORMAT.bold, VALUE_TYPE.number, HORIZONETAL_ALIGN.right);
}

const getProcessSymbol = async () => {
  const doc = await accessSheet();
  const sheet = await doc.sheetsByTitle[SUMMARY_SHEET];

  await sheet.loadCells(CELL.SUMMARY);

  const rows = await sheet.getRows();

  let result = [];
  rows.forEach((r) => {
    console.log(r['작업 여부'])
    if (r['작업 여부'] === 'TRUE') result.push(r['심볼']);
  })
  return result;
} 




module.exports = {
  existedSheet,
  createSheet,
  createSheetInitScan,
  updateCell,
  getInfo,
  updateEndBlock,
  addSummary,
  updateSummary,
  getProcessSymbol,
}