import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  const searchName = searchBox.value.trim();
  if (searchName === '') {
    clearHtml();
    return;
  }
  fetchCountries(searchName)
    .then(countries => {
      clearHtml();
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (countries.length > 2 && countries.length <= 10) {
        createCountryList(countries);
      }
      if (countries.length === 1) {
        createCountryInfo(countries);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearHtml();
      return error;
    });
}

function createCountryList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `
        <li>
            <img src="${flags.svg}" alt="${name.official}
            "width="30"> <h3>${name.official}</h3>
        </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function createCountryInfo(countries) {
  const markup = countries
    .map(({ flags, name, capital, population, languages }) => {
      return `
        <h1><img src="${flags.svg}" alt="${name.official}
        "width="30"> ${name.official}</h1>
        <p><b>Capital</b>: ${capital}</p>
        <p><b>Population</b>: ${population}</p>
        <p><b>Languages</b>: ${Object.values(languages)}</p>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function clearHtml() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
