import i18next from 'i18next';
import Backend from 'i18next-chained-backend';
import XHR from 'i18next-xhr-backend';
import LocalForage from 'i18next-localforage-backend';
import { initReactI18next } from 'react-i18next';
import { Config, ConfigI18n } from '../lib/Config';

export function bootI18n() {
  const {
    currentLanguageKey = 'hose_i18n_current_language',
    fallbackLanguage = 'en',
    defaultLanguage = 'en',
    cache = {storeName: 'hose_i18n'},
  } = Config.get<ConfigI18n>('i18n');

  const currentLanguage = localStorage.getItem(currentLanguageKey) || defaultLanguage;

  i18next.on('languageChanged', (lng: string) => {
    localStorage.setItem(currentLanguageKey, lng);
  });

  i18next
    .use(Backend)
    .use(initReactI18next)
    .init({
      lng: currentLanguage,
      fallbackLng: fallbackLanguage,
      ns: ['board', 'environment', 'gpio', 'watering', 'record', 'rule', 'error', 'common', 'notifications'],
      defaultNS: 'common',
      backend: {
        backends: [LocalForage, XHR],
        backendOptions: [
          {
            name: Config.get<string>('persist.dbName', '__hose__'),
            ...cache,
          },
          {
            loadPath: `${Config.get<string>('fetch.apiUrl')}/locales/{{lng}}/{{ns}}.json`,
            crossDomain: true
          }
        ]
      }
    })
}
