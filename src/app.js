import Papa from 'papaparse';
import _ from 'lodash';

export default () => {
  const state = {};

  const input = document.getElementById('exampleFormControlFile1');
  const form = document.querySelector('form');
  form.addEventListener('submit', async (e) => {
    const fReader = new FileReader();
    await fReader.readAsText(input.files[0]);
    fReader.onloadend = (event) => {
      const dataParsed = Papa.parse(event.target.result, { encoding: 'utf-8' });
      console.log(dataParsed.data);
      const { data: [keys, ...values] } = dataParsed;
      state.currentBanks = values.map(bank => _.zipObject(keys, bank));
      console.log(state);
    };
    e.preventDefault();
  });
};
