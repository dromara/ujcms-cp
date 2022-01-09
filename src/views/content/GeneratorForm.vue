<template>
  <div class="p-3 app-block">
    <el-form ref="form" :model="values" v-loading="loading" label-width="200px">
      <el-form-item :label="$t('generator.fulltext')">
        <el-button :disabled="perm('generator:fulltext:reindexAll')" :loading="buttonLoading" @click.prevent="handleFulltextReindexAll" type="primary" plain>
          {{ $t('generator.op.reindexAll') }}
        </el-button>
        <el-button v-if="!perm('generator:fulltext:reindexSite')" :loading="buttonLoading" @click.prevent="handleFulltextReindexSite" type="primary" plain>
          {{ $t('generator.op.reindexSite') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { fulltextReindexAll, fulltextReindexSite } from '@/api/content';
import { perm } from '@/store/useCurrentUser';

export default defineComponent({
  setup() {
    const { t } = useI18n();
    const type = ref<string>('base');
    const form = ref<any>(null);
    const values = ref<any>({});
    const buttonLoading = ref<boolean>(false);
    const siteList = ref<any[]>([]);
    const handleFulltextReindexAll = async () => {
      buttonLoading.value = true;
      try {
        await fulltextReindexAll();
        ElMessage.success(t('success'));
      } finally {
        buttonLoading.value = false;
      }
    };
    const handleFulltextReindexSite = async () => {
      buttonLoading.value = true;
      try {
        await fulltextReindexSite();
        ElMessage.success(t('success'));
      } finally {
        buttonLoading.value = false;
      }
    };
    return { form, buttonLoading, perm, type, values, handleFulltextReindexAll, handleFulltextReindexSite, siteList };
  },
});
</script>

<style lang="scss" scoped></style>
