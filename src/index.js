import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const country = document.querySelector('.country-info');

input.addEventListener('input', debounce(inputValue, DEBOUNCE_DELAY));

function inputValue() {
  const value = input.value.trim();

  if (value === '') {
    clearingInput();
    return;
  }

  fetchCountries(value)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (countries.length > 2 && countries.length < 10) {
        createMarkup(list, countryList, countries);
      }
      if (countries.length === 1) {
        createMarkup(country, countryInformation, countries);
      }
    })
    .catch(() => {
      return Notiflix.Notify.failure(
        'Oops, there is no country with that name'
      );
    });
}

function clearingInput() {
  list.innerHTML = '';
  country.innerHTML = '';
}

function createMarkup(el, func, arr) {
  const markup = arr.map(country => func(country)).join('');
  clearingInput();
  return el.insertAdjacentHTML('beforeend', markup);
}

function countryList({ name, flags }) {
  return `<li class="list">
        <img src="${flags.svg}" width = "40" alt="${name.official}" class="img">
        <p class ="title">${name.official}</p>
      </li>`;
}

function countryInformation({ name, capital, population, flags, languages }) {
  return `<ul>
<li class="list__item list"><img width=40 src="${
    flags.svg
  }" alt="flag"> <p class="list__item-country">${name.official}</p></li>
<li class="list__item"><span>Capital:</span> ${capital}</li>
<li class="list__item"><span>Population:</span> ${population}</li>
<li class="list__item"><span>Languages:</span> ${Object.values(languages).join(
    ', '
  )}</li>
    </ul>`;
}

// 1) повесить addEventListener на input
// 2) текущее значение в let
// 3) значение "2" в fetch динамически
// 4) при каждом изменение отправлять запрос
// 4.2) если пришло больше одной
// 5) обрабатываем ответ map
// 5.2) отрисовываем карточку одной строны
// 6) рендер на странице
// 7) Debounce
