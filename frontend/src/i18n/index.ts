import i18next from 'i18next';
import Backend from 'i18next-chained-backend';
import XHR from 'i18next-xhr-backend';
import LocalStorage from 'i18next-localstorage-backend';
import { initReactI18next } from 'react-i18next';

const currentLanguageKey = 'hose_i18n_current_language';

const currentLanguage = localStorage.getItem(currentLanguageKey) || 'en';

i18next.on("languageChanged", (lng: string) => {
  localStorage.setItem(currentLanguageKey, lng);
});

i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: currentLanguage,
    fallbackLng: 'en',
    ns: ['board', 'environment', 'gpio', 'watering', 'record', 'rule', 'error', 'common'],
    defaultNS: 'common',
    debug: true,
    backend: {
      backends: [LocalStorage, XHR],
      backendOptions: [
        {
          prefix: 'hose_i18n_'
        },
        {
          loadPath: 'http://localhost:5000/locales/{{lng}}/{{ns}}.json',
          crossDomain: true
        }
      ]
    }
  });
