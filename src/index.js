import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputName, DEBOUNCE_DELAY));

function onInputName(evt) {
  const name = evt.target.value.trim();

  if (!name) {
    refs.list.innerHTML = '';
    return;
  }

  fetchCountries(name)
    .then(data => {
      // console.dir(data);
      if (data.length > 20) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length === 1) {
        // console.log('длинна', data.length);
        createMarkupCountrie(data);
      } else {
        // console.log('длинна', data.length);
        createMarkupCountries(data);
      }
    })
    .catch(createErrorMessage);
}

function createMarkupCountrie(data) {
  const {
    flags: { svg },
    name,
    capital,
    population,
    languages
  } = data[0];
  const langs = languages.map(element => element.name);
  const markup = `<img src="${svg}" alt="${name}" width="30">
    <span style="font-size: 35px;font-weight: 700">${name}</span>
    <p><b>Capital: </b>${capital}</p>
      <p><b>Population: </b>${population}</p>
      <p><b>Languages: </b>${langs.join(', ')}</p>`;
  refs.list.innerHTML = '';
  refs.info.innerHTML = markup;
}

function createMarkupCountries(data) {
  const markup = data.map(
    ({ flags: { svg }, name }) => `<li>
    <img src="${svg}" alt="${name}" width="30">
    <span>${name}</span>    
    </li>`
  );
  refs.info.innerHTML = '';
  refs.list.innerHTML = markup.join('');
}

function createErrorMessage(err) {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
  // refs.input.value = ""
  Notify.failure(`Oops, there is no country with that name`);
}
