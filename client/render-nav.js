import countries from './countries.js';
import locales from './locales.js';
import { getCurrentLocaleParam, DEFAULT_LOCALE } from './i18nUtils.js';
import { ac, ce, ctn, FtmUrl } from './utils.js';
import sendEvent from './sendEvent.js';

const currentCountry = document.body.dataset.country;
const currentDataset = document.body.dataset.dataset;

const generateTopNav = () => {
  const currentLocale = getCurrentLocaleParam(DEFAULT_LOCALE);

  const localeDropdownLink = document.getElementById('locales-dropdown');
  const countryDropdownLink = document.getElementById('countries-dropdown');
  const localeDropdownItems = document.getElementById('locales-dropdown-selector');
  const countryDropdownItems = document.getElementById('countries-dropdown-selector');

  if (localeDropdownLink && countryDropdownLink && localeDropdownItems && countryDropdownItems) {
    const sortedLocales = locales.sort((localeA, localeB) => {
      const aLocalized = $.i18n(localeA.i18nString);
      const bLocalized = $.i18n(localeB.i18nString);
      return aLocalized.localeCompare(bLocalized);
    });

    sortedLocales.forEach((locale) => {
      if (locale.localeCode.toLowerCase() === currentLocale.toLowerCase()) {
        localeDropdownLink.textContent = $.i18n(locale.i18nString);
      }

      const element = document.createElement('a');
      element.className = 'dropdown-item';
      const currentUrl = new FtmUrl(window.location.href);
      currentUrl.searchparams.locale = locale.localeCode;
      element.setAttribute('href', currentUrl.toString());
      element.textContent = $.i18n(locale.i18nString);
      element.addEventListener('click', () => sendEvent('i18n', 'set-locale', locale.localeCode));
      localeDropdownItems.appendChild(element);
    });

    const sortedCountryKeys = Object.keys(countries).sort((a, b) => {
      const countryA = countries[a];
      const countryB = countries[b];

      const aLocalized = $.i18n(countryA.i18nString);
      const bLocalized = $.i18n(countryB.i18nString);

      return aLocalized.localeCompare(bLocalized);
    });

    sortedCountryKeys.forEach((countryCode) => {
      const country = countries[countryCode];

      if (country.countryCode === currentCountry.toLowerCase()) {
        const img = ce('div', `icon icon-cf_${country.countryCode}`);
        ac(countryDropdownLink, [img, ctn($.i18n(country.i18nString))]);
      }

      const element = document.createElement('a');
      element.className = 'dropdown-item i18n';
      const currentUrl = new FtmUrl(window.location.href);
      currentUrl.pathname = currentUrl.pathname.replace(/(\/[a-z]{2}\/|\/)/, `/${country.countryCode}/`);

      element.setAttribute('href', currentUrl.toString());

      const img = ce('div', `icon icon-cf_${country.countryCode}`);
      ac(element, [img, ctn($.i18n(country.i18nString))]);
      element.addEventListener('click', () => sendEvent('i18n', 'set-country', country.countryCode));
      countryDropdownItems.appendChild(element);
    });
  }
  $('.location-link').on('click', (e) => {
    e.preventDefault();
    const newLocation = $(e.currentTarget).data('location');
    // construct URL from country and dataset, leaving it out if either is "default"
    // in the case of currentCountry, that means US
    // in the case of dataset, we only include it if dataset === 'makers'
    // TODO: if we add a third dataset, that will need to change.
    let newUrl = '';
    if (currentCountry !== 'us') {
      newUrl += `/${currentCountry}`;
    }
    if (currentDataset === 'makers') {
      newUrl += `/${currentDataset}`;
    }
    newUrl += `/${newLocation}${window.location.search}`;
    window.location.assign(newUrl);
  });
};

$(() => {
  // this should happen after the translations load
  $('html').on('i18n:ready', () => {
    generateTopNav();
  });
});
