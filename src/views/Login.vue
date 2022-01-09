<template>
  <div class="h-full p-3 bg-gray-100">
    <el-form ref="form" :model="bean" class="mx-auto md:max-w-xs">
      <h3 class="py-5 text-center text-3xl font-bold text-primary">UJCMS</h3>
      <el-alert v-if="error" :title="error" type="error" class="mb-3" :closable="false" show-icon />
      <el-form-item prop="username" :rules="[{ required: true, message: () => $t('v.required') }]">
        <el-input ref="username" v-model="bean.username" type="text" name="username" :placeholder="$t('username')" prefix-icon="el-icon-user" autocomplete="on" />
      </el-form-item>
      <el-form-item prop="password" :rules="[{ required: true, message: () => $t('v.required') }]">
        <el-input ref="password" v-model="bean.password" type="password" name="password" :placeholder="$t('password')" prefix-icon="el-icon-lock" show-password />
      </el-form-item>
      <el-button type="primary" native-type="submit" class="w-full" :loading="loading" @click.prevent="handleLogin">{{ $t('login') }}</el-button>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';
import { LocationQueryValue, useRoute, useRouter } from 'vue-router';
import { login } from '@/store/useCurrentUser';

export default defineComponent({
  name: 'Login',
  setup() {
    const form = ref<any>(null);
    const bean = ref<any>({});
    const error = ref<string | null>(null);
    const loading = ref<boolean>(false);
    const redirect = ref<string | null>(null);
    const route = useRoute();
    const router = useRouter();
    if (process.env.NODE_ENV === 'development') {
      bean.value = { username: 'admin', password: 'password' };
    } else if (process.env.NODE_ENV === 'demo') {
      bean.value = { username: 'demo', password: '123' };
    }

    watchEffect(() => {
      redirect.value = route.query.redirect as LocationQueryValue;
    });

    const handleLogin = () => {
      form.value.validate(async (valid: boolean) => {
        if (!valid) return;
        loading.value = true;
        try {
          const data = await login(bean.value);
          // 登录失败，显示错误信息
          if (data.status !== 0) {
            error.value = data.message;
            return;
          }
          if (redirect.value) {
            router.push(redirect.value);
          } else {
            // 从 403 页面跳转到登录页面时，使用 router.push 会继续回到 403 页面，可能是页面缓存所致
            window.location.reload();
          }
        } finally {
          loading.value = false;
        }
      });
    };
    return {
      form,
      bean,
      error,
      loading,
      handleLogin,
    };
  },
});
</script>
