<template>
  <el-container>
    <el-aside width="180px" class="pr-3">
      <el-tabs v-model="type" @tab-click="({ paneName }) => tabClick(paneName)" tab-position="left" stretch class="bg-white">
        <el-tab-pane v-for="tp in types" :key="tp" :name="tp" :label="$t(`site.settings.${tp}`)"></el-tab-pane>
      </el-tabs>
    </el-aside>
    <el-main class="p-3 app-block">
      <el-form ref="form" :model="values" v-loading="loading" label-width="150px">
        <template v-if="type === 'watermark'">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="enabled" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="site.watermark.enabled" help /></template>
                <el-switch v-model="values.enabled"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="overlay" :label="$t('site.watermark.overlay')" :rules="values.enabled ? { required: true, message: () => $t('v.required') } : {}">
                <image-upload v-model="values.overlay"></image-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="position" :label="$t('site.watermark.position')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-radio-group v-model="values.position">
                  <div class="watermark-position">
                    <el-radio v-for="n in 9" :key="n" :label="n" :title="$t(`site.watermark.position.${n}`)"><span></span></el-radio>
                  </div>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="dissolve" :label="$t('site.watermark.dissolve')" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="site.watermark.dissolve" help /></template>
                <el-slider v-model="values.dissolve" :min="0" :max="100" show-input></el-slider>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="minWidth" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="site.watermark.minWidth" help /></template>
                <el-input v-model.number="values.minWidth" :min="1" :max="65535"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="minHeight" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="site.watermark.minHeight" help /></template>
                <el-input v-model.number="values.minHeight" :min="1" :max="65535"></el-input>
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
              <el-form-item prop="name" :label="$t('site.name')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-input v-model="values.name" ref="focus" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="protocol" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="site.protocol" help /></template>
                <el-select v-model="values.protocol" class="w-full">
                  <el-option v-for="item in ['http', 'https']" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="domain"
                :rules="[
                  { required: true, message: () => $t('v.required') },
                  { pattern: /^[a-z0-9-.]*$/, message: () => $t('site.error.domainPattern') },
                  { pattern: /^(?!(uploads|templates|WEB-INF|cp)$).*/i, message: () => $t('site.error.excludesPattern') },
                ]"
              >
                <template #label><label-tip message="site.domain" help /></template>
                <el-input v-model="values.domain" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="subDir"
                :rules="[
                  { pattern: /^[\w-]*$/, message: () => $t('site.error.subDirPattern') },
                  { pattern: /^(?!(uploads|templates|WEB-INF|cp)$).*/i, message: () => $t('site.error.excludesPattern') },
                ]"
              >
                <template #label><label-tip message="site.subDir" help /></template>
                <el-input v-model="values.subDir" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="theme" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="site.theme" help /></template>
                <el-select v-model="values.theme" class="w-full">
                  <el-option v-for="item in themeList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="mobileTheme" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="site.mobileTheme" help /></template>
                <el-select v-model="values.mobileTheme" class="w-full">
                  <el-option v-for="item in themeList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="modelId" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="site.model" help /></template>
                <el-select v-model="values.modelId" class="w-full">
                  <el-option v-for="item in modelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="logo">
                <template #label><label-tip message="site.logo" help /></template>
                <image-upload v-model="values.logo"></image-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="seoTitle">
                <template #label><label-tip message="site.seoTitle" help /></template>
                <el-input v-model="values.seoTitle" maxlength="150"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="seoKeywords">
                <template #label><label-tip message="site.seoKeywords" help /></template>
                <el-input v-model="values.seoKeywords" maxlength="150"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="seoDescription">
                <template #label><label-tip message="site.seoDescription" help /></template>
                <el-input v-model="values.seoDescription" type="textarea" :rows="3" maxlength="1000"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="pageSize" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="site.pageSize" help /></template>
                <el-input-number v-model="values.pageSize" :min="1" :max="200"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="status">
                <template #label><label-tip message="site.status" help /></template>
                <el-radio-group v-model="values.status">
                  <el-radio v-for="n in [0, 1]" :key="n" :label="n">{{ $t(`site.status.${n}`) }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <div>
          <el-button :disabled="perm(`siteSettings:${type}:update`)" :loading="buttonLoading" @click.prevent="handleSubmit" type="primary" native-type="submit">
            {{ $t('submit') }}
          </el-button>
        </div>
      </el-form>
    </el-main>
  </el-container>
</template>

<script lang="ts">
export default { name: 'SiteSettings' };
</script>

<script setup lang="ts">
import { defineEmits, onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { toTree } from '@/utils/tree';
import { querySiteSettings, updateSiteBaseSettings, updateSiteWatermarkSettings, updateSiteCustomsSettings, queryCurrentSiteThemeList, queryModelList } from '@/api/config';
import { queryOrgList } from '@/api/user';
import { perm, hasPermission } from '@/store/useCurrentUser';
import LabelTip from '@/components/LabelTip.vue';
import { ImageUpload } from '@/components/Upload';
import FieldItem from '@/views/config/components/FieldItem.vue';

defineEmits({ 'update:modelValue': null, finished: null });

const { t } = useI18n();
const form = ref<any>();
const site = ref<any>();
const values = ref<any>({});
const loading = ref<boolean>(false);
const buttonLoading = ref<boolean>(false);
const orgList = ref<any[]>([]);
const themeList = ref<string[]>([]);
const modelList = ref<any[]>([]);
const modelId = ref<number>();
const model = computed(() => modelList.value.find((item) => item.id === modelId.value));
const fields = computed(() => JSON.parse(model.value?.customs || '[]'));

const types: string[] = [];
if (hasPermission('siteSettings:base:update')) types.push('base');
if (hasPermission('siteSettings:watermark:update')) types.push('watermark');
if (hasPermission('siteSettings:customs:update')) types.push('customs');
const type = ref<string>(types[0]);

const tabClick = (paneName?: string | number) => {
  if (paneName === 'watermark') {
    values.value = site.value.watermark;
  } else if (paneName === 'customs') {
    values.value = site.value.customs;
  } else {
    values.value = site.value;
  }
};

const fetchThemeList = async () => {
  themeList.value = await queryCurrentSiteThemeList();
};
const fetchOrgList = async () => {
  orgList.value = toTree(await queryOrgList());
};
const fetchModelList = async () => {
  modelList.value = await queryModelList({ type: 'site' });
};
const fetchSiteSetting = async () => {
  site.value = await querySiteSettings();
  modelId.value = site.value.modelId;
  tabClick(type.value);
};
onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([fetchThemeList(), fetchOrgList(), fetchModelList(), fetchSiteSetting()]);
  } finally {
    loading.value = false;
  }
});
const load = async () => {
  loading.value = true;
  try {
    await fetchSiteSetting();
  } finally {
    loading.value = false;
  }
};
const handleSubmit = () => {
  form.value.validate(async (valid: boolean) => {
    if (!valid) return;
    buttonLoading.value = true;
    try {
      if (type.value === 'watermark') {
        await updateSiteWatermarkSettings(values.value);
      } else if (type.value === 'customs') {
        await updateSiteCustomsSettings(values.value);
      } else {
        await updateSiteBaseSettings(values.value);
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
.watermark-position {
  @apply bg-gray-100 w-36 h-36 flex flex-wrap rounded border border-dashed;
  :deep(.el-radio__label) {
    padding-left: 0;
  }
  :deep(.el-radio) {
    margin-right: 0;
    @apply w-1/3 h-1/3 flex justify-center items-center;
  }
}
</style>
