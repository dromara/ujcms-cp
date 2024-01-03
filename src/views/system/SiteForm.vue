<script lang="ts">
export default { name: 'SiteForm' };
</script>

<script setup lang="ts">
import { computed, watch, ref, toRefs, onMounted, PropType } from 'vue';
import { toTree, disableSubtree } from '@/utils/tree';
import { querySite, createSite, updateSite, deleteSite, querySiteList, querySiteThemeList } from '@/api/system';
import { queryModelList } from '@/api/config';
import { queryOrgList } from '@/api/user';
import DialogForm from '@/components/DialogForm.vue';
import LabelTip from '@/components/LabelTip.vue';
import { ImageUpload } from '@/components/Upload';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  beanId: { type: Number, default: null },
  beanIds: { type: Array as PropType<number[]>, required: true },
  parentId: { type: Number, default: null },
  showGlobalData: { type: Boolean, required: true },
});
const { showGlobalData, modelValue: visible } = toRefs(props);
const emit = defineEmits({ 'update:modelValue': null, finished: null });
const focus = ref<any>();
const values = ref<any>({});
const siteTree = ref<any[]>([]);
const parentSiteTree = computed(() => disableSubtree(siteTree.value, values.value.id));
const copyFromSiteTree = ref<any[]>([]);
const orgTree = ref<any[]>([]);
const themeList = ref<string[]>([]);
const modelList = ref<any[]>([]);

const fetchSiteList = async () => {
  siteTree.value = toTree(await querySiteList({ current: !showGlobalData.value }));
};
const fetchCopyFromSiteList = async () => {
  copyFromSiteTree.value = toTree(await querySiteList({ currentOrg: !showGlobalData.value }));
};
const beanChange = async (bean: any) => {
  themeList.value = bean.id ? await querySiteThemeList(bean.id) : [];
};
const finished = async () => {
  await fetchSiteList();
  emit('finished');
};
const fetchOrgList = async () => {
  orgTree.value = toTree(await queryOrgList({ current: !showGlobalData.value }));
};
const fetchModelList = async () => {
  modelList.value = await queryModelList({ type: 'site' });
};
watch(visible, () => {
  if (visible.value) {
    fetchCopyFromSiteList();
    fetchSiteList();
    fetchOrgList();
  }
});
onMounted(() => {
  fetchOrgList();
  fetchModelList();
});
</script>

<template>
  <dialog-form
    v-model:values="values"
    :name="$t('menu.system.site')"
    :query-bean="querySite"
    :create-bean="createSite"
    :update-bean="updateSite"
    :delete-bean="deleteSite"
    :bean-id="beanId"
    :bean-ids="beanIds"
    :focus="focus"
    :init-values="(bean: any) => ({
      status: 0,
      pageSize: 20,
      protocol: 'http',
      copyData: ['template', 'model'],
      theme: themeList[0],
      mobileTheme: themeList[0],
      copyFromId: copyFromSiteTree[0]?.id,
      parentId: bean?.id !== parentId ? (bean?.parentId ?? parentId) : parentId,
      orgId: bean?.orgId ?? orgTree[0]?.id,
    })"
    :to-values="(bean:any) => ({ ...bean })"
    perms="site"
    :model-value="modelValue"
    large
    @update:model-value="(event) => $emit('update:modelValue', event)"
    @finished="finished"
    @bean-change="beanChange"
  >
    <template #default="{ isEdit }">
      <el-row>
        <el-col v-if="!isEdit" :span="12">
          <el-form-item prop="copyFromId" :rules="{ required: true, message: () => $t('v.required') }">
            <template #label><label-tip message="site.copyFrom" help /></template>
            <el-tree-select
              v-model="values.copyFromId"
              :data="copyFromSiteTree"
              node-key="id"
              :default-expanded-keys="copyFromSiteTree.map((item) => item.id)"
              :props="{ label: 'name' }"
              :render-after-expand="false"
              check-strictly
              class="w-full"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="!isEdit" :span="12">
          <el-form-item prop="copyData">
            <template #label><label-tip message="site.copyData" help /></template>
            <el-checkbox-group v-model="values.copyData">
              <el-checkbox
                v-for="(item, index) in ['template', 'model', 'channel']"
                :key="item"
                :label="item"
                @change="(value) => (values.copyData = ['template', 'model', 'channel'].slice(0, value ? index + 1 : index))"
              >
                {{ $t('site.copyData.' + item) }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col v-if="!isEdit || showGlobalData || values.id !== siteTree[0]?.id" :span="24">
          <el-form-item prop="parentId" :label="$t('site.parent')">
            <el-tree-select
              v-model="values.parentId"
              :data="parentSiteTree"
              node-key="id"
              :default-expanded-keys="parentSiteTree.map((item) => item.id)"
              :props="{ label: 'name', disabled: 'disabled' }"
              :render-after-expand="false"
              check-strictly
              :clearable="showGlobalData"
              class="w-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="name" :label="$t('site.name')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-input ref="focus" v-model="values.name" maxlength="50"></el-input>
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
          <el-form-item prop="orgId" :rules="{ required: true, message: () => $t('v.required') }">
            <template #label><label-tip message="site.org" help /></template>
            <el-tree-select
              v-model="values.orgId"
              :data="orgTree"
              node-key="id"
              :default-expanded-keys="orgTree.map((item) => item.id)"
              :props="{ label: 'name' }"
              :render-after-expand="false"
              check-strictly
              class="w-full"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="isEdit" :span="12">
          <el-form-item prop="modelId" :rules="{ required: true, message: () => $t('v.required') }">
            <template #label><label-tip message="site.model" help /></template>
            <el-select v-model="values.modelId" class="w-full">
              <el-option v-for="item in modelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="isEdit" :span="12">
          <el-form-item prop="theme" :rules="{ required: true, message: () => $t('v.required') }">
            <template #label><label-tip message="site.theme" help /></template>
            <el-select v-model="values.theme" class="w-full">
              <el-option v-for="item in themeList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="isEdit" :span="12">
          <el-form-item prop="mobileTheme" :rules="{ required: true, message: () => $t('v.required') }">
            <template #label><label-tip message="site.mobileTheme" help /></template>
            <el-select v-model="values.mobileTheme" class="w-full">
              <el-option v-for="item in themeList" :key="item" :label="item" :value="item"></el-option>
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
          <el-form-item prop="pageSize">
            <template #label><label-tip message="site.pageSize" help /></template>
            <el-input-number v-model="values.pageSize"></el-input-number>
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
  </dialog-form>
</template>
