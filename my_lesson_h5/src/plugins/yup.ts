import * as yupLocales from 'yup-locales';
import * as yup from 'yup';

export function init() {
  yup.setLocale(yupLocales.zh);
  // yup.addMethod(
  //   yup.string,
  //   'email',
  //   function (message = yup.defaultLocale.string?.email) {
  //     // https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
  //     return this.matches(
  //       /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
  //       {
  //         name: 'email',
  //         message,
  //         excludeEmptyString: true,
  //       },
  //     );
  //   },
  // );
}
