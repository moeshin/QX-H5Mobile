/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify';
import VuetifyNotifier from 'vuetify-notifier';
import * as yup from './yup';

import pinia from '../store';
import router from '../router';

// Types
import type { App } from 'vue';

export function registerPlugins(app: App) {
  yup.init();

  app
    .use(vuetify)
    .use(VuetifyNotifier, {
      default: {
        defaultColor: 'secondary',
      },
    })
    .use(router)
    .use(pinia);
}
