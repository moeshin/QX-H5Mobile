import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';
import piniaPersist from 'pinia-plugin-persist-uni'
import App from './App.vue';

export function createApp() {
  const app = createSSRApp(App);
  app.use(Pinia.createPinia().use(piniaPersist));

  return {
    app,
    Pinia,
  };
}
