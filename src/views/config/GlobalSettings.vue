<template>
  <el-container>
    <el-aside width="180px" class="pr-3">
      <el-tabs v-model="type" @tab-click="({ paneName }) => tabClick(paneName)" tab-position="left" stretch class="bg-white">
        <el-tab-pane v-for="tp in types" :key="tp" :name="tp" :label="$t(`global.settings.${tp}`)"></el-tab-pane>
      </el-tabs>
    </el-aside>
    <el-main class="p-3 app-block">
      <el-form ref="form" :model="values" v-loading="loading" label-width="150px">
        <template v-if="type === 'upload'">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="imageTypes" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.imageTypes" /></template>
                <el-input v-model="values.imageTypes" maxlength="255"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="imageLimit" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.imageLimit" /></template>
                <el-input-number v-model="values.imageLimit" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="videoTypes" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.videoTypes" /></template>
                <el-input v-model="values.videoTypes" maxlength="255"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="videoLimit" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.videoLimit" /></template>
                <el-input-number v-model="values.videoLimit" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="docTypes" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.docTypes" /></template>
                <el-input v-model="values.docTypes" maxlength="255"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="docLimit" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.docLimit" /></template>
                <el-input-number v-model="values.docLimit" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="fileTypes" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.fileTypes" /></template>
                <el-input v-model="values.fileTypes" maxlength="255"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="fileLimit" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.fileLimit" /></template>
                <el-input-number v-model="values.fileLimit" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="imageMaxWidth" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.imageMaxWidth" /></template>
                <el-input-number v-model="values.imageMaxWidth" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="imageMaxHeight" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="global.upload.imageMaxHeight" /></template>
                <el-input-number v-model="values.imageMaxHeight" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-else-if="type === 'customs'">
          <el-row>
            <el-col v-for="field in fields" :key="field.code" :span="field.double ? 12 : 24">
              <el-form-item :prop="field.code" :label="field.name" :rules="field.required ? { required: true, message: () => $t('v.required') } : undefined">
                <field-item :field="field" v-model="values[field.code]"></field-item>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="port">
                <template #label><label-tip message="global.port" /></template>
                <el-input-number v-model="values.port" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="contextPath">
                <template #label><label-tip message="global.contextPath" /></template>
                <el-input v-model="values.contextPath" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="channelUrl">
                <template #label><label-tip message="global.channelUrl" /></template>
                <el-input v-model="values.channelUrl" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="articleUrl">
                <template #label><label-tip message="global.articleUrl" /></template>
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
          <el-button :disabled="perm(`globalSettings:${type}:update`)" :loading="buttonLoading" @click.prevent="handleSubmit" type="primary" native-type="submit">
            {{ $t('submit') }}
          </el-button>
        </div>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { toTree } from '@/utils/tree';
import { querySiteList } from '@/api/system';
import { queryGlobalModel, queryGlobalSettings, updateGlobalBaseSettings, updateGlobalCustomsSettings, updateGlobalUploadSettings } from '@/api/config';
import { perm, hasPermission } from '@/store/useCurrentUser';
import LabelTip from '@/components/LabelTip.vue';
import FieldItem from '@/views/config/components/FieldItem.vue';

const { t } = useI18n();
const form = ref<any>();
const global = ref<any>({});
const values = ref<any>({});
const loading = ref<boolean>(false);
const buttonLoading = ref<boolean>(false);
const siteList = ref<any[]>([]);
const model = ref<any>();
const fields = computed(() => JSON.parse(model.value?.customs || '[]'));

const types: string[] = [];
if (hasPermission('globalSettings:base:update')) types.push('base');
if (hasPermission('globalSettings:upload:update')) types.push('upload');
if (hasPermission('globalSettings:customs:update')) types.push('customs');
const type = ref<string>(types[0]);

const tabClick = (paneName: string | number | undefined) => {
  if (paneName === 'upload') {
    values.value = global.value.upload;
  } else if (paneName === 'customs') {
    values.value = global.value.customs;
  } else {
    values.value = global.value;
  }
};

const fetchGlobalModel = async () => {
  model.value = await queryGlobalModel();
};
const fetchGlobalSettings = async () => {
  global.value = await queryGlobalSettings();
  tabClick(type.value);
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
      if (type.value === 'upload') {
        await updateGlobalUploadSettings(values.value);
      } else if (type.value === 'customs') {
        await updateGlobalCustomsSettings(values.value);
      } else {
        await updateGlobalBaseSettings(values.value);
      }
      ElMessage.success(t('success'));
    } finally {
      buttonLoading.value = false;
    }
    load();
  });
};
</script>

<style lang="scss" scoped>
.el-tabs {
  :deep(.el-tabs__header) {
    float: right;
    margin-right: 1px;
  }
}
</style>
