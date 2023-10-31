/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify';
import VuetifyUseDialog from 'vuetify-use-dialog';
import * as yup from './yup';

import pinia from '../store';
import router from '../router';

// Types
import type { App } from 'vue';

export function registerPlugins(app: App) {
  yup.init();

  app
    .use(vuetify)
    .use(VuetifyUseDialog)
    .use(router)
    .use(pinia);
}
