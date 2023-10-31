<template>
  <div
    style="
      height: 40vh;
      display: flex;
      justify-content: center;
      align-items: center;
    "
  >
    <VAvatar :image="avatar" size="30vh" color="grey" />
  </div>

  <VForm class="mx-4" @submit="onSubmit">
    <VTextField
      v-bind="email"
      label="邮箱"
      variant="solo"
      prepend-inner-icon="mdi-email"
    />
    <VTextField
      v-bind="username"
      label="账号"
      variant="solo"
      prepend-inner-icon="mdi-account"
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
    <VTextField
      v-bind="passwordConfirm"
      label="确认密码"
      variant="solo"
      prepend-inner-icon="mdi-lock"
      :type="passwordConfirmVisible ? 'text' : 'password'"
      :append-inner-icon="passwordConfirmVisible ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="passwordConfirmVisible = !passwordConfirmVisible"
    />

    <VRow>
      <VCol cols="6">
        <VBtn block color="primary" type="submit">提交</VBtn>
      </VCol>
      <VCol cols="6">
        <VBtn block to="/login">提交</VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import * as api from '@/api/jqrjq';
import { useSnackbar } from 'vuetify-use-dialog';

const schema = yup.object({
  username: yup.string().label('账号').min(8).max(20).required(),
  email: yup.string().label('邮箱').email().required(),
  password: yup.string().label('密码').min(8).max(20).required(),
  passwordConfirm: yup
    .string()
    .label('确认密码')
    .oneOf([yup.ref('password')], '两次密码不一致')
    .required(),
});

const { defineComponentBinds, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const vuetifyConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const username = defineComponentBinds('username', vuetifyConfig);
const email = defineComponentBinds('email', vuetifyConfig);
const password = defineComponentBinds('password', vuetifyConfig);
const passwordConfirm = defineComponentBinds('passwordConfirm', vuetifyConfig);

const passwordVisible = ref(false);
const passwordConfirmVisible = ref(false);

email.value['onUpdate:modelValue']('a@a.a');
username.value['onUpdate:modelValue']('7w6jrK98');
password.value['onUpdate:modelValue']('12345678');
passwordConfirm.value['onUpdate:modelValue']('12345678');

const avatar = ref('/src/assets/logo.svg');

const router = useRouter();
const createSnackbar = useSnackbar();

const onSubmit = handleSubmit(({ email, username, password }) => {
  api.register(email, username, password).then(
    () => {
      router.push('/profile');
    },
    (reason) => {
      console.error(reason);
      if (reason instanceof api.ApiDataError) {
        createSnackbar({ text: reason.message });
      } else {
        console.error(reason);
      }
    },
  );
});
</script>
