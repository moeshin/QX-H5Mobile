<template>
  <VContainer>
    <VForm @submit="onSubmit">
      <VTextField
        v-bind="email"
        label="邮箱"
        variant="solo"
        prepend-inner-icon="mdi-email"
      />
      <VTextField
        v-bind="password"
        label="密码"
        variant="solo"
        prepend-inner-icon="mdi-lock"
        :type="passwordVisible ? 'text' : 'password'"
        :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="passwordVisible = !passwordVisible"
      />
      <VRow>
        <VCol cols="6">
          <VBtn block color="primary" type="submit">登录</VBtn>
        </VCol>
        <VCol cols="6">
          <VBtn block to="/register">注册</VBtn>
        </VCol>
      </VRow>
    </VForm>
  </VContainer>
</template>
<script lang="ts" setup>
import * as api from '@/api/jqrjq';
import { useAuthStore } from '@/store/auth';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNotifier } from 'vuetify-notifier';
import * as yup from 'yup';

const $notifier = useNotifier();

const schema = yup.object({
  email: yup.string().label('邮箱').email().required(),
  password: yup.string().label('密码').min(8).max(20).required(),
});

const { defineComponentBinds, handleSubmit } = useForm({
  validationSchema: schema,
});

const vuetifyConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const email = defineComponentBinds('email', vuetifyConfig);
const password = defineComponentBinds('password', vuetifyConfig);

const passwordVisible = ref(false);

// email.value['onUpdate:modelValue']('a@a.a');
// password.value['onUpdate:modelValue']('12345678');

const router = useRouter();
const authStore = useAuthStore();

const onSubmit = handleSubmit(({ email, password }) => {
  console.log('onSubmit', { email, password });
  api.login(email, password).then(
    ({ userinfo }) => {
      authStore.user = userinfo;
      $notifier.toastSuccess('登录成功');
      router.push('/profile');
    },
    (reason) => {
      if (reason instanceof api.ApiDataError) {
        console.warn(reason);
        $notifier.alertError({
          title: '登录失败',
          text: reason.message,
        });
      } else {
        console.error(reason);
      }
    },
  );
});
</script>
