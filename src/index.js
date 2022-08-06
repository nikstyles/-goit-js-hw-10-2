import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('input');
const list = document.querySelector('.country-list');
const divBlockOneCountry = document.querySelector('.country-info');

input.addEventListener('input', debounce(fetchCountries, DEBOUNCE_DELAY));

function fetchCountries(evt) {
  let currentSearch;
  //   console.log(evt.target.value);
  currentSearch = evt.target.value.trim();

  fetch(
    `https://restcountries.com/v3.1/name/${currentSearch}?fields=name,capital,population,flags,languages`
  )
    .then(response => response.json())
    .then(data => {
      console.log('data', data);
      markup(data);
    })
    .catch(error => {
      console.log('error', error);
    });
}

function markup(arr) {
  const listOneMarkup = createOneCountryList(arr);
  const listMarkup = createlist(arr);

  if (arr.length === 1) {
    divBlockOneCountry.innerHTML = listOneMarkup;
    list.innerHTML = '';
  } else if (arr.length > 10) {
    list.innerHTML = '';
    divBlockOneCountry.innerHTML = '';
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (arr.length <= 10 && arr.length > 2) {
    list.innerHTML = listMarkup;
    divBlockOneCountry.innerHTML = '';
  }
}

function createlist(arr) {
  return arr?.reduce(
    (acc, { flags, name }) =>
      acc +
      `<li class="list">
     <img  src="${flags.svg}" alt="flag" width=40> <p>${name.official}</p>
    </li>`,
    ''
  );
}

function createOneCountryList(arr) {
  return arr?.reduce(
    (acc, { flags, name, capital, population, languages }) =>
      acc +
      `<ul>
<li class="list__item list"><img width=40 src="${
        flags.svg
      }" alt="flag"> <p class="list__item-country">${name.official}</p></li>
<li class="list__item"><span>Capital:</span> ${capital}</li>
<li class="list__item"><span>Population:</span> ${population}</li>
<li class="list__item"><span>Languages:</span> ${Object.values(languages).join(
        ', '
      )}</li>
    </ul>`,
    ''
  );
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
