import * as yupLocales from 'yup-locales';
import * as yup from 'yup';

export function init() {
  yup.setLocale(yupLocales.zh);
}
