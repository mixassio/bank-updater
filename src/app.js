import Papa from 'papaparse';

export default () => {
  const input = document.getElementById('exampleFormControlFile1');
  const form = document.querySelector('form');
  form.addEventListener('submit', async (e) => {
    const fReader = new FileReader();
    await fReader.readAsText(input.files[0]);
    console.log(input.files);
    fReader.onloadend = (event) => {
      console.log(event.target.result);
      const obj = Papa.parse(event.target.result, { encoding: 'utf-8' });
      const obj2 = Papa.parse(input.files[0], { encoding: 'utf-8' });
      console.log(obj);
      console.log(obj2);
    };
    e.preventDefault();
  });
};
