const BASE_URL = 'https://restcountries.com/v3.1/name';

function fetchCountries(name) {
  return fetch(
    `${BASE_URL}/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    return response.json();
  });
}

export { fetchCountries };
