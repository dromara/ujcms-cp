<script setup lang="ts">
import { computed } from 'vue';
import { ElConfigProvider } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { getElementPlusLocale } from '@/i18n';

const { locale } = useI18n({ useScope: 'global' });
const lang = computed(() => getElementPlusLocale(locale.value as string));
</script>

<template>
  <el-config-provider :locale="lang">
    <router-view />
  </el-config-provider>
</template>
