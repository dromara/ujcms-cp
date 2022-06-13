<template>
  <el-container>
    <el-aside width="180px" class="pr-3">
      <el-tabs v-model="type" @tab-click="({ paneName }) => tabClick(paneName)" tab-position="left" stretch class="bg-white">
        <el-tab-pane v-for="tp in types" :key="tp" :name="tp" :label="$t(`config.settings.${tp}`)"></el-tab-pane>
      </el-tabs>
    </el-aside>
    <el-main class="p-3 app-block">
      <el-form ref="form" :model="values" v-loading="loading" label-width="150px">
        <template v-if="type === 'upload'">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="imageTypes" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="config.upload.imageTypes" help /></template>
                <el-input v-model="values.imageTypes" maxlength="255"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="imageLimit" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="config.upload.imageLimit" help /></template>
                <el-input-number v-model="values.imageLimit" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="videoTypes" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="config.upload.videoTypes" help /></template>
                <el-input v-model="values.videoTypes" maxlength="255"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="videoLimit" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="config.upload.videoLimit" help /></template>
                <el-input-number v-model="values.videoLimit" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="libraryTypes" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="config.upload.libraryTypes" help /></template>
                <el-input v-model="values.libraryTypes" maxlength="255"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="libraryLimit" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="config.upload.libraryLimit" help /></template>
                <el-input-number v-model="values.libraryLimit" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="docTypes" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="config.upload.docTypes" help /></template>
                <el-input v-model="values.docTypes" maxlength="255"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="docLimit" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="config.upload.docLimit" help /></template>
                <el-input-number v-model="values.docLimit" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="fileTypes" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="config.upload.fileTypes" help /></template>
                <el-input v-model="values.fileTypes" maxlength="255"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="fileLimit" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="config.upload.fileLimit" help /></template>
                <el-input-number v-model="values.fileLimit" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="imageMaxWidth" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="config.upload.imageMaxWidth" help /></template>
                <el-input-number v-model="values.imageMaxWidth" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="imageMaxHeight" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="config.upload.imageMaxHeight" help /></template>
                <el-input-number v-model="values.imageMaxHeight" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-else-if="type === 'uploadStorage' || type === 'htmlStorage' || type === 'templateStorage'">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="type" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="config.storage.type" /></template>
                <el-select v-model="values.type" class="w-full">
                  <el-option
                    v-for="n in [0, 1].filter((item) => item !== 1 || currentUser.epRank > 0 || currentUser.epDisplay)"
                    :disabled="currentUser.epRank <= 0 && currentUser.epDisplay"
                    :key="n"
                    :value="n"
                    :label="$t(`config.storage.type.${n}`)"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="path" :rules="{ pattern: /^(?!.*\.\.).*$/, message: () => $t('v.url') }">
                <template #label><label-tip message="config.storage.path" /></template>
                <el-input v-model="values.path" maxlength="160"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="url" :rules="{ pattern: /^(?!.*\.\.).*$/, message: () => $t('v.url') }">
                <template #label><label-tip message="config.storage.url" /></template>
                <el-input v-model="values.url" maxlength="160"></el-input>
              </el-form-item>
            </el-col>
            <template v-if="values.type === 1">
              <el-col :span="24">
                <el-form-item prop="endpoint" :rules="{ required: true, message: () => $t('v.required') }">
                  <template #label><label-tip message="config.storage.endpoint" /></template>
                  <el-input v-model="values.endpoint" maxlength="160"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="region" :rules="{ required: true, message: () => $t('v.required') }">
                  <template #label><label-tip message="config.storage.region" /></template>
                  <el-input v-model="values.region" maxlength="160"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="bucket" :rules="{ required: true, message: () => $t('v.required') }">
                  <template #label><label-tip message="config.storage.bucket" /></template>
                  <el-input v-model="values.bucket" maxlength="160"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="accessKey" :rules="{ required: true, message: () => $t('v.required') }">
                  <template #label><label-tip message="config.storage.accessKey" /></template>
                  <el-input v-model="values.accessKey" type="password" show-password maxlength="160"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="secretKey" :rules="{ required: true, message: () => $t('v.required') }">
                  <template #label><label-tip message="config.storage.secretKey" /></template>
                  <el-input v-model="values.secretKey" type="password" show-password maxlength="160"></el-input>
                </el-form-item>
              </el-col>
            </template>
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
              <el-form-item prop="port" :rules="{ type: 'number', min: 0, max: 65535, message: () => $t('v.range', { min: 0, max: 65535 }) }">
                <template #label><label-tip message="config.port" help /></template>
                <el-input v-model.number="values.port"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="contextPath">
                <template #label><label-tip message="config.contextPath" help /></template>
                <el-input v-model="values.contextPath" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="channelUrl" :rules="{ pattern: /^\/[\w-]+$/, message: () => $t('config.error.channelUrlPattern') }">
                <template #label><label-tip message="config.channelUrl" help /></template>
                <el-input v-model="values.channelUrl" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="articleUrl">
                <template #label><label-tip message="config.articleUrl" help /></template>
                <el-input v-model="values.articleUrl" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="defaultSiteId" :label="$t('config.defaultSite')">
                <el-cascader
                  v-model="values.defaultSiteId"
                  :options="siteList"
                  :props="{ value: 'id', label: 'name', checkStrictly: true }"
                  @change="(value) => (values.defaultSiteId = value?.[value.length - 1])"
                  class="w-full"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="multiDomain">
                <template #label><label-tip message="config.multiDomain" help /></template>
                <el-switch v-model="values.multiDomain" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <div>
          <el-button :disabled="perm(`config:${type}:update`)" :loading="buttonLoading" @click.prevent="handleSubmit" type="primary" native-type="submit">
            {{ $t('submit') }}
          </el-button>
        </div>
      </el-form>
    </el-main>
  </el-container>
</template>

<script lang="ts">
export default { name: 'GlobalSettings' };
</script>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { toTree } from '@/utils/tree';
import { querySiteList } from '@/api/system';
import {
  queryConfigModel,
  queryConfig,
  queryUploadStorage,
  queryHtmlStorage,
  queryTemplateStorage,
  updateConfigBase,
  updateConfigCustoms,
  updateConfigUpload,
  updateUploadStorage,
  updateHtmlStorage,
  updateTemplateStorage,
} from '@/api/config';
import { perm, hasPermission, currentUser } from '@/store/useCurrentUser';
import LabelTip from '@/components/LabelTip.vue';
import FieldItem from '@/views/config/components/FieldItem.vue';

const { t } = useI18n();
const form = ref<any>();
const config = ref<any>({});
const values = ref<any>({});
const loading = ref<boolean>(false);
const buttonLoading = ref<boolean>(false);
const siteList = ref<any[]>([]);
const model = ref<any>();
const fields = computed(() => JSON.parse(model.value?.customs || '[]'));

const types: string[] = [];
if (hasPermission('config:base:update')) types.push('base');
if (hasPermission('config:upload:update')) types.push('upload');
if (hasPermission('config:uploadStorage:update')) types.push('uploadStorage');
if (hasPermission('config:htmlStorage:update')) types.push('htmlStorage');
if (hasPermission('config:templateStorage:update')) types.push('templateStorage');
if (hasPermission('config:customs:update')) types.push('customs');
const type = ref<string>(types[0]);

const tabClick = async (paneName?: string | number) => {
  if (paneName === 'upload') {
    values.value = config.value.upload;
  } else if (paneName === 'uploadStorage') {
    values.value = await queryUploadStorage();
  } else if (paneName === 'htmlStorage') {
    values.value = await queryHtmlStorage();
  } else if (paneName === 'templateStorage') {
    values.value = await queryTemplateStorage();
  } else if (paneName === 'customs') {
    values.value = config.value.customs;
  } else {
    values.value = config.value;
  }
};

const fetchConfigModel = async () => {
  model.value = await queryConfigModel();
};
const fetchConfig = async () => {
  config.value = await queryConfig();
  tabClick(type.value);
};
const fetchSiteList = async () => {
  siteList.value = toTree(await querySiteList());
};
onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([fetchConfig(), fetchConfigModel(), fetchSiteList()]);
  } finally {
    loading.value = false;
  }
});
const load = async () => {
  loading.value = true;
  try {
    await fetchConfig();
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
        await updateConfigUpload(values.value);
      } else if (type.value === 'customs') {
        await updateConfigCustoms(values.value);
      } else if (type.value === 'uploadStorage') {
        await updateUploadStorage(values.value);
      } else if (type.value === 'htmlStorage') {
        await updateHtmlStorage(values.value);
      } else if (type.value === 'templateStorage') {
        await updateTemplateStorage(values.value);
      } else {
        await updateConfigBase(values.value);
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
