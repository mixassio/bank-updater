import Papa from 'papaparse';
import _ from 'lodash';

export default () => {
  const state = {};

  const inputBD = document.getElementById('fileBD');
  const inputXML = document.getElementById('XMLcbrf');
  const form = document.querySelector('form');
  form.addEventListener('submit', async (e) => {
    const fReaderCSV = new FileReader();
    await fReaderCSV.readAsText(inputBD.files[0]);
    fReaderCSV.onloadend = (event) => {
      const dataParsed = Papa.parse(event.target.result, { encoding: 'utf-8' });
      // console.log(dataParsed.data);
      const { data: [keys, ...values] } = dataParsed;
      state.currentBanksBD = values.map(bank => _.zipObject(keys, bank));
    };
    const fReaderXML = new FileReader();
    await fReaderXML.readAsText(inputXML.files[0], 'CP1251');
    fReaderXML.onloadend = (event2) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(event2.target.result, 'application/xml');
      // console.log(doc);
      const items = doc.querySelectorAll('BICDirectoryEntry');
      state.new = [...items].map((item) => {
        const info = item.querySelector('ParticipantInfo');
        const bankInfo = [...info.attributes].reduce((acc, el) => (
          { ...acc, [el.name]: el.textContent }
        ), {});
        const accountsList = item.querySelectorAll('Accounts');
        const accounts = [...accountsList]
          .map(account => [...account.attributes].reduce((acc, el) => (
            { ...acc, [el.name]: el.textContent }
          ), {}));
        return { ...bankInfo, accounts, bic: item.getAttribute('BIC') };
      });
    };
    e.preventDefault();
  });
  console.log(state);
};
