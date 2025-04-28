import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./Locale/ar.json"
import en from "./Locale/en.json"
import fr from "./Locale/fr.json"

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en,
            fr,
            ar
        },
        lng: 'en',
        fallbackLng: 'en',
        debug: false, 
        ns: ['translations'],
        defaultNS: 'translations',
        keySeparator: false,
        interpolation: {
            escapeValue: false,
            formatSeparator: ',',
        },
        react: {
            wait: true,
        },
    });

export default i18n;