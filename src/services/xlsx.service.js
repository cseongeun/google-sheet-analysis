const Xlsx = require('xlsx-populate');

const fetchHeaderArray= (objArr) => {
  let headers = new Set();

  objArr.forEach((obj) => {
    headers = new Set([...headers, ...Object.keys(obj)]);
  });
  return [...headers];
}

const setWorksheetHeader = (headerArr, ws) => {
  headerArr.forEach((h, index) => { ws.row(1).cell(index + 1).value(h); });
}

async function objectArrayToXlsx(target) {
  const headers = fetchHeaderArray(target);
  const wb = await Xlsx.fromBlankAsync();
  const ws = wb.sheet(0);
  setWorksheetHeader(headers, ws);

  target.forEach((obj, rows) => {
    headers.forEach((h, cols) => {
      const data = obj[h]
      ws.row(rows + 2).cell(cols + 1).value(data);
    });
  });
  return wb;
}

async function xlsxToBuffer(wb) {
  return wb.outputAsync();
}


module.exports = {
  objectArrayToXlsx,
  xlsxToBuffer,
};