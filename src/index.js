import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchCountry = document.getElementById('search-box');
const listCountry = document.querySelector('.country-list');
const infoCountry = document.querySelector('.country-info');

const markupReset = link => (link.innerHTML = '');
const handlerInput = e => {
  const inputCountry = e.target.value.trim();
  if (!inputCountry) {
    markupReset(listCountry);
    markupReset(infoCountry);
    return;
  }
  fetchCountries(inputCountry)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      createMarkup(data);
    })
    .catch(error => {
      markupReset(listCountry);
      markupReset(infoCountry);
      Notify.failure('Oops, there is no country with that name');
    });
};
const createMarkup = data => {
  if (data.length === 1) {
    markupReset(listCountry);
    const markupInfoCountry = createMarkupInfo(data);
    infoCountry.innerHTML = markupInfoCountry;
  } else {
    markupReset(infoCountry);
    const markupListCountry = createMarkupList(data);
    listCountry.innerHTML = markupListCountry;
  }
};
const createMarkupList = data => {
  return data
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `<p><img src="${svg}" alt="${official}" width="30" height="20"> ${official}</p>`
    )
    .join('');
};
const createMarkupInfo = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.png}" alt=" ${
        name.official
      }" width="30" height="20">${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
  );
};

searchCountry.addEventListener('input', debounce(handlerInput, DEBOUNCE_DELAY));
