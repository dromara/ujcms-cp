<template>
  <dialog-form
    :name="$t('menu.content.channel')"
    :queryBean="queryChannel"
    :createBean="createChannel"
    :updateBean="updateChannel"
    :deleteBean="deleteChannel"
    :beanId="beanId"
    :beanIds="beanIds"
    :focus="focus"
    :initValues="
      (bean) => ({
        parentId: bean?.parentId ?? parent?.id,
        type: 1,
        channelModelId: bean?.channelModelId ?? parent?.channelModelId ?? channelModelList[0]?.id,
        articleModelId: bean?.articleModelId ?? parent?.articleModelId ?? articleModelList[0]?.id,
        groupIds: bean?.groupIds ?? parent?.groupIds ?? groupList.map((item) => item.id),
        nav: bean?.nav ?? parent?.nav ?? true,
        channelTemplate: bean?.channelTemplate ?? parent?.channelTemplate ?? channelTemplates[0],
        articleTemplate: bean?.articleTemplate ?? parent?.articleTemplate ?? articleTemplates[0],
        pageSize: 20,
        allowComment: bean?.allowComment ?? parent?.allowComment ?? true,
        allowContribute: bean?.allowContribute ?? parent?.allowContribute ?? true,
        allowSearch: bean?.allowSearch ?? parent?.allowSearch ?? true,
        customs: initCustoms({}),
      })
    "
    :toValues="(bean) => ({ ...bean })"
    perms="channel"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @finished="finished"
    @beanChange="
      (bean) => {
        channelModelId = bean?.channelModelId ?? parent?.channelModelId ?? articleModelList[0]?.id;
        fetchChannelList();
      }
    "
    labelWidth="120px"
    large
  >
    <template #default="{ values, isEdit }">
      <el-row>
        <el-col :span="18">
          <el-row>
            <el-col :span="mains['name'].double ? 12 : 24">
              <el-form-item prop="name" :label="mains['name'].name ?? $t('channel.name')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-input v-model="values.name" ref="focus" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="mains['alias'].double ? 12 : 24">
              <el-form-item prop="alias" :rules="isEdit ? { required: true, message: () => $t('v.required') } : {}">
                <template #label><label-tip :label="mains['alias'].name ?? $t('channel.alias')" message="channel.alias" /></template>
                <el-input v-model="values.alias" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="mains['linkUrl'].double ? 12 : 24" v-if="values.type === 3">
              <el-form-item prop="linkUrl" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip :label="mains['linkUrl'].name ?? $t('channel.linkUrl')" message="channel.linkUrl" /></template>
                <el-input v-model="values.linkUrl" maxlength="255">
                  <template #append>
                    <el-checkbox v-model="values.targetBlank">{{ $t('channel.targetBlank') }}</el-checkbox>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <template v-if="values.type < 3">
              <el-col :span="mains['seoTitle'].double ? 12 : 24" v-if="mains['seoTitle'].show">
                <el-form-item
                  prop="seoTitle"
                  :label="mains['seoTitle'].name ?? $t('channel.seoTitle')"
                  :rules="mains['seoTitle'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <el-input v-model="values.seoTitle" maxlength="150"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="mains['seoKeywords'].double ? 12 : 24" v-if="mains['seoKeywords'].show">
                <el-form-item
                  prop="seoKeywords"
                  :label="mains['seoKeywords'].name ?? $t('channel.seoKeywords')"
                  :rules="mains['seoKeywords'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <el-input v-model="values.seoKeywords" maxlength="150"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="mains['seoDescription'].double ? 12 : 24" v-if="mains['seoDescription'].show">
                <el-form-item
                  prop="seoDescription"
                  :label="mains['seoDescription'].name ?? $t('channel.seoDescription')"
                  :rules="mains['seoDescription'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <el-input v-model="values.seoDescription" maxlength="1000"></el-input>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="mains['channelModel'].double ? 12 : 24" v-if="mains['channelModel'].show">
              <el-form-item prop="channelModelId" :label="mains['channelModel'].name ?? $t('channel.channelModel')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-select
                  v-model="values.channelModelId"
                  class="w-full"
                  @change="
                    (value) => {
                      channelModelId = value;
                      if (!isEdit) {
                        $nextTick().then(() => {
                          initCustoms(values.customs);
                        });
                      }
                    }
                  "
                >
                  <el-option v-for="item in channelModelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="mains['articleModel'].double ? 12 : 24" v-if="mains['articleModel'].show">
              <el-form-item prop="articleModelId" :label="mains['articleModel'].name ?? $t('channel.articleModel')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-select v-model="values.articleModelId" class="w-full">
                  <el-option v-for="item in articleModelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <template v-if="values.type !== 3">
              <el-col :span="mains['channelTemplate'].double ? 12 : 24" v-if="mains['channelTemplate'].show">
                <el-form-item
                  prop="channelTemplate"
                  :label="mains['channelTemplate'].name ?? $t('channel.channelTemplate')"
                  :rules="mains['channelTemplate'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <el-select v-model="values.channelTemplate" class="w-full">
                    <el-option v-for="item in channelTemplates" :key="item" :label="item + '.html'" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="mains['articleTemplate'].double ? 12 : 24" v-if="mains['articleTemplate'].show">
                <el-form-item
                  prop="articleTemplate"
                  :label="mains['articleTemplate'].name ?? $t('channel.articleTemplate')"
                  :rules="mains['articleTemplate'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <el-select v-model="values.articleTemplate" class="w-full">
                    <el-option v-for="item in articleTemplates" :key="item" :label="item + '.html'" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="mains['group'].double ? 12 : 24" v-if="mains['group'].show">
              <el-form-item
                prop="groupIds"
                :label="mains['group'].name ?? $t('channel.group')"
                :rules="mains['group'].required ? { required: true, message: () => $t('v.required') } : undefined"
              >
                <el-checkbox-group v-model="values.groupIds">
                  <el-tooltip v-for="item in groupList" :key="item.id" :content="item.description">
                    <el-checkbox :label="item.id">{{ item.name }}</el-checkbox>
                  </el-tooltip>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="mains['allowComment'].double ? 12 : 24" v-if="mains['allowComment'].show">
              <el-form-item
                prop="allowComment"
                :label="mains['allowComment'].name ?? $t('channel.allowComment')"
                :rules="mains['allowComment'].required ? { required: true, message: () => $t('v.required') } : undefined"
              >
                <el-switch v-model="values.allowComment"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="mains['allowContribute'].double ? 12 : 24" v-if="mains['allowContribute'].show">
              <el-form-item
                prop="allowContribute"
                :label="mains['allowContribute'].name ?? $t('channel.allowContribute')"
                :rules="mains['allowContribute'].required ? { required: true, message: () => $t('v.required') } : undefined"
              >
                <el-switch v-model="values.allowContribute"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="mains['nav'].double ? 12 : 24" v-if="mains['nav'].show">
              <el-form-item prop="nav" :rules="mains['nav'].required ? { required: true, message: () => $t('v.required') } : undefined">
                <template #label><label-tip :label="mains['nav'].name ?? $t('channel.nav')" message="channel.nav" /></template>
                <el-switch v-model="values.nav"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="mains['allowSearch'].double ? 12 : 24" v-if="mains['allowSearch'].show">
              <el-form-item
                prop="allowSearch"
                :label="mains['allowSearch'].name ?? $t('channel.allowSearch')"
                :rules="mains['allowSearch'].required ? { required: true, message: () => $t('v.required') } : undefined"
              >
                <el-switch v-model="values.allowSearch"></el-switch>
              </el-form-item>
            </el-col>
            <template v-for="field in fields" :key="field.code">
              <el-col :span="field.double ? 12 : 24">
                <el-form-item :prop="`customs.${field.code}`" :label="field.name" :rules="field.required ? { required: true, message: () => $t('v.required') } : undefined">
                  <field-item :field="field" v-model="values.customs[field.code]"></field-item>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="mains['text'].double ? 12 : 24" v-if="values.type === 2">
              <el-form-item
                prop="text"
                :label="mains['text'].name ?? $t('channel.text')"
                :rules="mains['text'].required ? { required: true, message: () => $t('v.required') } : undefined"
              >
                <tinymce v-model="values.text" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6" class="el-form--label-top label-top">
          <el-tabs type="border-card" class="ml-5">
            <el-tab-pane :label="$t('channel.tabs.setting')">
              <el-form-item prop="type" :label="asides['type'].name ?? $t('channel.type')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-select v-model="values.type" class="w-full">
                  <el-option v-for="n in [1, 2, 3]" :key="n" :label="$t(`channel.type.${n}`)" :value="n"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="parentId" :label="asides['parent'].name ?? $t('channel.parent')">
                <el-cascader
                  v-model="values.parentId"
                  :options="channelList"
                  :props="{ value: 'id', label: 'name', checkStrictly: true }"
                  @change="(value) => (values.parentId = value?.[value.length - 1])"
                  clearable
                  class="w-full"
                ></el-cascader>
              </el-form-item>
              <el-form-item prop="pageSize" :label="asides['pageSize'].name ?? $t('channel.pageSize')" :rules="{ required: true, message: () => $t('v.required') }">
                <el-input-number v-model="values.pageSize" :min="1" :max="200"></el-input-number>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </template>
  </dialog-form>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted, ref, computed, toRefs, watch } from 'vue';
import { toTree, disableSubtree } from '@/utils/tree';
import { queryChannel, createChannel, updateChannel, deleteChannel, queryChannelList, queryChannelTemplates, queryArticleTemplates } from '@/api/content';
import { queryModelList } from '@/api/config';
import { queryGroupList } from '@/api/user';
import { getModelData, mergeModelFields, arr2obj } from '@/data';
import FieldItem from '@/views/config/components/FieldItem.vue';
import DialogForm from '@/components/DialogForm.vue';
import LabelTip from '@/components/LabelTip.vue';
import Tinymce from '@/components/Tinymce/index.vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  beanId: { required: true },
  beanIds: { type: Array, required: true },
  parent: { type: Object, default: null },
});
const emit = defineEmits({ 'update:modelValue': null, finished: null });

const { modelValue: visible, parent } = toRefs(props);
const focus = ref<any>();
const channelList = ref<any[]>([]);
const channelModelList = ref<any[]>([]);
const articleModelList = ref<any[]>([]);
const groupList = ref<any[]>([]);
const channelTemplates = ref<any[]>([]);
const articleTemplates = ref<any[]>([]);
const channelModelId = ref<number>();
const channelModel = computed(() => channelModelList.value.find((item) => item.id === channelModelId.value));
const mains = computed(() => arr2obj(mergeModelFields(getModelData().channel.mains, channelModel.value?.mains, 'channel')));
const asides = computed(() => arr2obj(mergeModelFields(getModelData().channel.asides, channelModel.value?.asides, 'channel')));
const fields = computed(() => JSON.parse(channelModel.value?.customs || '[]'));
watch(visible, () => {
  if (visible) {
    channelModelId.value = parent.value?.articleModelId ?? channelModelList.value[0]?.id;
  }
});
const fetchChannelList = async (bean?: any) => {
  channelList.value = disableSubtree(toTree(await queryChannelList()), bean?.id);
};
const finished = async (bean?: any) => {
  await fetchChannelList(bean);
  emit('finished');
};
const fetchChannelModelList = async () => {
  channelModelList.value = await queryModelList({ Q_EQ_type: 'channel' });
  // 如果 channelModelId 无值，则默认赋予第一个模型的值
  if (channelModelId.value == null && channelModelList.value.length > 0) {
    channelModelId.value = channelModelList.value[0].id;
  }
};
const fetchArticleModelList = async () => {
  articleModelList.value = await queryModelList({ Q_EQ_type: 'article' });
};
const fetchGroupList = async () => {
  groupList.value = await queryGroupList();
};
const fetchChannelTemplates = async () => {
  channelTemplates.value = await queryChannelTemplates();
};
const fetchArticleTemplates = async () => {
  articleTemplates.value = await queryArticleTemplates();
};
onMounted(() => {
  fetchChannelModelList();
  fetchArticleModelList();
  fetchGroupList();
  fetchChannelTemplates();
  fetchArticleTemplates();
  fetchChannelList();
});
const initCustoms = (customs: any) => {
  fields.value.forEach((field: any) => {
    // eslint-disable-next-line no-param-reassign
    customs[field.code] = field.defaultValue;
  });
  return customs;
};
</script>

<style lang="scss" scoped>
.label-top {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
