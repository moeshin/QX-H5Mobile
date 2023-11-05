import * as types from '@/utils/types';
import { useUserStore } from '@/store/user';
import { defineComponent } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { VAppBar, VAppBarTitle, VBtn, VSpacer } from 'vuetify/components';

export const AppBar = defineComponent<VAppBar['$props']>(
  (_props, { slots }) => {
    const router = useRouter();
    const userStore = useUserStore();

    return () => (
      <VAppBar v-slots={slots}>
        <RouterLink to=''/>
        <VBtn
          icon="mdi-arrow-left"
          {...({
            onClick: () => {
              console.log('back');
              router.go(-1);
            },
          } as types.EventLisenter)}
        />
        <VAppBarTitle>Home</VAppBarTitle>
        <VSpacer />
        { userStore.info && (<VBtn icon="mdi-logout" to="/logout" />) }
        <VBtn icon="mdi-account" to="/profile" />
      </VAppBar>
    );
  },
);

export default AppBar;
