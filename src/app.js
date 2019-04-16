import Papa from 'papaparse';
import _ from 'lodash';

export default () => {
  const state = {};
  const stat = {
    '00': [],
    '10': [],
    '12': [],
    '15': [],
    '16': [],
    '20': [],
    '30': [],
    '40': [],
    '51': [],
    '52': [],
    '60': [],
    '65': [],
    '71': [],
    '75': [],
    '78': [],
    '90': [],
    '99': [],
  };

  const inputBD = document.getElementById('fileBD');
  const inputXML = document.getElementById('XMLcbrf');
  const form = document.querySelector('form');
  form.addEventListener('submit', async (e) => {
    const fReaderCSV = new FileReader();
    await fReaderCSV.readAsText(inputBD.files[0]);
    fReaderCSV.onloadend = (event) => {
      const dataParsed = Papa.parse(event.target.result, { encoding: 'utf-8' });
      console.log(dataParsed.data);
      const { data: [keys, ...values] } = dataParsed;
      state.currentBanksBD = values.map(bank => _.zipObject(keys, bank));
    };
    const fReaderXML = new FileReader();
    await fReaderXML.readAsText(inputXML.files[0], 'CP1251');
    fReaderXML.onloadend = (event2) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(event2.target.result, 'application/xml');
      console.log(doc);
      const items = doc.querySelectorAll('BICDirectoryEntry');
      state.new = [...items].map((item) => {
        const info = item.querySelector('ParticipantInfo');
        console.log(item.getAttribute('BIC'), [...info.attributes]);
        const bankInfo = [...info.attributes].reduce((acc, el) => (
          { ...acc, [el.name]: el.textContent }
        ), {});
        console.log(bankInfo.PtType, stat[bankInfo.PtType])
        const accountsList = item.querySelectorAll('Accounts');
        const accounts = [...accountsList]
          .map(account => [...account.attributes].reduce((acc, el) => (
            { ...acc, [el.name]: el.textContent }
          ), {}));
        stat[bankInfo.PtType] = [...stat[bankInfo.PtType], { ...bankInfo, accounts, bic: item.getAttribute('BIC') }];
        return { ...bankInfo, accounts, bic: item.getAttribute('BIC') };
      });
      console.log(stat);
    };
    e.preventDefault();
  });
  console.log(state);
};
