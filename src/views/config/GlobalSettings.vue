<template>
  <el-container>
    <el-aside width="180px" class="pr-3">
      <el-tabs v-model="type" tab-position="left" stretch class="bg-white">
        <el-tab-pane v-for="type in ['base', 'upload', 'customs']" :key="type" :name="type" :label="$t(`global.settings.${type}`)"></el-tab-pane>
      </el-tabs>
    </el-aside>
    <el-main class="p-3 app-block">
      <el-form ref="form" :model="values" v-loading="loading" label-width="150px">
        <template v-if="type === 'upload'">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="upload.imageTypes" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.imageTypes"/></template>
                <el-input v-model="values.upload.imageTypes" maxlength="255"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="upload.imageLimit" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.imageLimit"/></template>
                <el-input-number v-model="values.upload.imageLimit" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="upload.videoTypes" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.videoTypes"/></template>
                <el-input v-model="values.upload.videoTypes" maxlength="255"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="upload.videoLimit" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.videoLimit"/></template>
                <el-input-number v-model="values.upload.videoLimit" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="upload.docTypes" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.docTypes"/></template>
                <el-input v-model="values.upload.docTypes" maxlength="255"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="upload.docLimit" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.docLimit"/></template>
                <el-input-number v-model="values.upload.docLimit" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="upload.fileTypes" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.fileTypes"/></template>
                <el-input v-model="values.upload.fileTypes" maxlength="255"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="upload.fileLimit" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.fileLimit"/></template>
                <el-input-number v-model="values.upload.fileLimit" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="upload.imageMaxWidth" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.imageMaxWidth"/></template>
                <el-input-number v-model="values.upload.imageMaxWidth" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="upload.imageMaxHeight" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.imageMaxHeight"/></template>
                <el-input-number v-model="values.upload.imageMaxHeight" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-else-if="type === 'customs'">
          <el-row>
            <el-col v-for="field in fields" :key="field.code" :span="field.double ? 12 : 24">
              <el-form-item :prop="`customs.${field.code}`" :label="field.name" :rules="field.required ? { required: true, message: () => $t('v.required') } : undefined">
                <field-item :field="field" v-model="values.customs[field.code]"></field-item>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="port">
                <template #label><label-tip message="global.port"/></template>
                <el-input-number v-model="values.port" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="contextPath">
                <template #label><label-tip message="global.contextPath"/></template>
                <el-input v-model="values.contextPath" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="channelUrl">
                <template #label><label-tip message="global.channelUrl"/></template>
                <el-input v-model="values.channelUrl" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="articleUrl">
                <template #label><label-tip message="global.articleUrl"/></template>
                <el-input v-model="values.articleUrl" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="defaultSiteId" :label="$t('global.defaultSite')">
                <el-cascader
                  v-model="values.defaultSiteId"
                  :options="siteList"
                  :props="{ value: 'id', label: 'name', checkStrictly: true }"
                  @change="(value) => (values.defaultSiteId = value?.[value.length - 1])"
                  class="w-full"
                ></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <div>
          <el-button :disabled="perm('globalSettings:update')" :loading="buttonLoading" @click.prevent="handleSubmit" type="primary" native-type="submit" size="small">
            {{ $t('submit') }}
          </el-button>
        </div>
      </el-form>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { toTree } from '@/utils/tree';
import { querySiteList } from '@/api/system';
import { queryGlobalModel, queryGlobalSettings, updateGlobalSettings } from '@/api/config';
import { perm } from '@/store/useCurrentUser';
import LabelTip from '@/components/LabelTip.vue';
import FieldItem from '@/views/config/components/FieldItem.vue';

export default defineComponent({
  components: { LabelTip, FieldItem },
  setup() {
    const { t } = useI18n();
    const type = ref<string>('base');
    const form = ref<any>(null);
    const values = ref<any>({});
    const loading = ref<boolean>(false);
    const buttonLoading = ref<boolean>(false);
    const siteList = ref<any[]>([]);
    const model = ref<any>();
    const fields = computed(() => JSON.parse(model.value?.customs || '[]'));
    const fetchGlobalModel = async () => {
      model.value = await queryGlobalModel();
    };
    const fetchGlobalSettings = async () => {
      values.value = await queryGlobalSettings();
    };
    const fetchSiteList = async () => {
      siteList.value = toTree(await querySiteList());
    };
    onMounted(async () => {
      loading.value = true;
      try {
        await Promise.all([fetchGlobalSettings(), fetchGlobalModel(), fetchSiteList()]);
      } finally {
        loading.value = false;
      }
    });
    const load = async () => {
      loading.value = true;
      try {
        await fetchGlobalSettings();
      } finally {
        loading.value = false;
      }
    };
    const handleSubmit = () => {
      form.value.validate(async (valid: boolean) => {
        if (!valid) return;
        buttonLoading.value = true;
        try {
          await updateGlobalSettings(values.value);
          ElMessage.success(t('success'));
        } finally {
          buttonLoading.value = false;
        }
        load();
      });
    };
    return { form, loading, buttonLoading, perm, type, fields, values, handleSubmit, siteList };
  },
});
</script>

<style lang="scss" scoped>
.el-tabs {
  :deep(.el-tabs__header) {
    float: right;
    margin-right: 1px;
  }
}
</style>
