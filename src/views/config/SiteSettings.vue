<template>
  <el-container>
    <el-aside width="180px" class="pr-3">
      <el-tabs v-model="type" tab-position="left" stretch class="bg-white">
        <el-tab-pane v-for="type in ['base', 'watermark', 'customs']" :key="type" :name="type" :label="$t(`site.settings.${type}`)"></el-tab-pane>
      </el-tabs>
    </el-aside>
    <el-main class="p-3 app-block">
      <el-form ref="form" :model="values" v-loading="loading" label-width="150px">
        <template v-if="type === 'watermark'">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="watermark.enabled" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="site.watermark.enabled"/></template>
                <el-switch v-model="values.watermark.enabled"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="watermark.overlay"
                :label="$t('site.watermark.overlay')"
                :rules="values.watermark.enabled ? { required: true, message: () => $t('v.required') } : {}"
              >
                <image-upload v-model="values.watermark.overlay"></image-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="watermark.position" :label="$t('site.watermark.position')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-radio-group v-model="values.watermark.position">
                  <div class="watermark-position">
                    <el-radio v-for="n in 9" :key="n" :label="n" :title="$t(`site.watermark.position.${n}`)"><span></span></el-radio>
                  </div>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="watermark.dissolve" :label="$t('site.watermark.dissolve')" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="site.watermark.dissolve"/></template>
                <el-slider v-model="values.watermark.dissolve" :min="0" :max="100" show-input></el-slider>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="watermark.minWidth" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="site.watermark.minWidth"/></template>
                <el-input v-model.number="values.watermark.minWidth" :min="1" :max="65535"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="watermark.minHeight" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="site.watermark.minHeight"/></template>
                <el-input v-model.number="values.watermark.minHeight" :min="1" :max="65535"></el-input>
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
              <el-form-item prop="name" :label="$t('site.name')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-input v-model="values.name" ref="focus" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="protocol" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="site.protocol"/></template>
                <el-select v-model="values.protocol" class="w-full">
                  <el-option v-for="item in ['http', 'https']" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="domain" :label="$t('site.domain')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-input v-model="values.domain" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="subDir">
                <template #label><label-tip message="site.subDir"/></template>
                <el-input v-model="values.subDir" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="theme" :label="$t('site.theme')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-select v-model="values.theme" class="w-full">
                  <el-option v-for="item in themeList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="mobileTheme" :label="$t('site.mobileTheme')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-select v-model="values.mobileTheme" class="w-full">
                  <el-option v-for="item in themeList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="orgId" :label="$t('site.org')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-cascader
                  v-model="values.orgId"
                  :options="orgList"
                  :props="{ value: 'id', label: 'name', checkStrictly: true }"
                  @change="(value) => (values.orgId = value?.[value.length - 1])"
                  class="w-full"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="storageId" :label="$t('site.storage')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-select v-model="values.storageId" class="w-full">
                  <el-option v-for="item in storageList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="htmlStorageId" :label="$t('site.htmlStorage')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-select v-model="values.htmlStorageId" class="w-full">
                  <el-option v-for="item in htmlStorageList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="mobileStorageId" :label="$t('site.mobileStorage')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-select v-model="values.mobileStorageId" class="w-full">
                  <el-option v-for="item in htmlStorageList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="modelId" :label="$t('site.model')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-select v-model="values.modelId" class="w-full">
                  <el-option v-for="item in modelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="status" :label="$t('site.status')">
                <el-radio-group v-model="values.status">
                  <el-radio v-for="n in [0, 1]" :key="n" :label="n">{{ $t(`site.status.${n}`) }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="logo" :label="$t('site.logo')">
                <image-upload v-model="values.logo"></image-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="seoTitle" :label="$t('site.seoTitle')">
                <el-input v-model="values.seoKeywords" maxlength="150"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="seoKeywords" :label="$t('site.seoKeywords')">
                <el-input v-model="values.seoKeywords" maxlength="150"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="seoDescription" :label="$t('site.seoDescription')">
                <el-input v-model="values.seoDescription" maxlength="1000"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="pageSize" :label="$t('site.pageSize')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-input-number v-model="values.pageSize" :min="1" :max="200"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <div>
          <el-button :disabled="perm('siteSettings:update')" :loading="buttonLoading" @click.prevent="handleSubmit" type="primary" native-type="submit" size="small">
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
// import _ from 'lodash';
import { toTree } from '@/utils/tree';
import { querySiteSettings, updateSiteSettings, queryCurrentSiteThemeList, queryModelList } from '@/api/config';
import { queryStorageList } from '@/api/system';
import { queryOrgList } from '@/api/user';
import { perm } from '@/store/useCurrentUser';
import LabelTip from '@/components/LabelTip.vue';
import { ImageUpload } from '@/components/Upload';
import FieldItem from '@/views/config/components/FieldItem.vue';

export default defineComponent({
  components: { LabelTip, ImageUpload, FieldItem },
  emits: { 'update:modelValue': null, finished: null },
  setup() {
    const { t } = useI18n();
    const type = ref<string>('base');
    const form = ref<any>(null);
    const values = ref<any>({});
    const loading = ref<boolean>(false);
    const buttonLoading = ref<boolean>(false);
    const orgList = ref<any[]>([]);
    const storageList = ref<any[]>([]);
    const htmlStorageList = ref<any[]>([]);
    const themeList = ref<string[]>([]);
    const modelList = ref<any[]>([]);
    const modelId = ref<number>();
    const model = computed(() => modelList.value.find((item) => item.id === modelId.value));
    const fields = computed(() => JSON.parse(model.value?.customs || '[]'));

    const fetchStorageList = async () => {
      storageList.value = await queryStorageList({ Q_EQ_type_Int: 2 });
    };
    const fetchHtmlStorageList = async () => {
      htmlStorageList.value = await queryStorageList({ Q_EQ_type_Int: 1 });
    };
    const fetchThemeList = async () => {
      themeList.value = await queryCurrentSiteThemeList();
    };
    const fetchOrgList = async () => {
      orgList.value = toTree(await queryOrgList());
    };
    const fetchModelList = async () => {
      modelList.value = await queryModelList({ Q_EQ_type: 'site' });
    };
    const fetchSiteSetting = async () => {
      values.value = await querySiteSettings();
      modelId.value = values.value.modelId;
    };
    onMounted(async () => {
      loading.value = true;
      try {
        await Promise.all([fetchStorageList(), fetchHtmlStorageList(), fetchThemeList(), fetchOrgList(), fetchModelList(), fetchSiteSetting()]);
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
          await updateSiteSettings(values.value);
          ElMessage.success(t('success'));
        } finally {
          buttonLoading.value = false;
        }
        load();
      });
    };
    return { form, loading, buttonLoading, perm, type, values, fields, orgList, modelList, storageList, htmlStorageList, themeList, handleSubmit };
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
