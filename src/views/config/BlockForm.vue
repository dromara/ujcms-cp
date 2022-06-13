<template>
  <dialog-form
    :name="$t('menu.config.block')"
    :queryBean="queryBlock"
    :createBean="createBlock"
    :updateBean="updateBlock"
    :deleteBean="deleteBlock"
    :beanId="beanId"
    :beanIds="beanIds"
    :focus="focus"
    :initValues="(): any => ({
      scope: 0,
      withLinkUrl: true,
      linkUrlRequired: true,
      withSubtitle: false,
      subtitleRequired: false,
      withDescription: false,
      descriptionRequired: false,
      withImage: false,
      imageRequired: false,
      imageWidth: 300,
      imageHeight: 200,
      withMobileImage: false,
      mobileImageRequired: false,
      mobileImageWidth: 300,
      mobileImageHeight: 200,
      enabled: true,
      recommendable: true,
    })"
    :toValues="(bean: any) => ({ ...bean })"
    perms="block"
    v-model:values="values"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @finished="$emit('finished')"
  >
    <template #default="{ bean }">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="name" :label="$t('block.name')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-input v-model="values.name" ref="focus" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            prop="alias"
            :label="$t('block.alias')"
            :rules="[
              { required: true, message: () => $t('v.required') },
              {
                asyncValidator: async (rule: any, value: any, callback: any) => {
                  if (value !== bean.alias && (await blockAliasExist(value, values.scope))) {
                    callback($t('block.error.aliasExist'));
                  }
                  callback();
                },
              },
            ]"
          >
            <el-input v-model="values.alias" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            prop="scope"
            :label="$t('block.scope')"
            :rules="[
              { required: true, message: () => $t('v.required') },
              {
                asyncValidator: async (rule: any, value: any, callback: any) => {
                  if (value !== bean.scope && await blockScopeNotAllowed(values.scope)) {
                    callback($t('block.error.scopeNotAllowd'));
                  }
                  callback();
                },
              },
            ]"
          >
            <el-radio-group v-model="values.scope">
              <el-radio v-for="n in [0, 2]" :key="n" :label="n">{{ $t(`block.scope.${n}`) }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="withLinkUrl" :label="$t('block.withLinkUrl')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-switch v-model="values.withLinkUrl"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="linkUrlRequired" :label="$t('block.linkUrlRequired')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-switch v-model="values.linkUrlRequired"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="withSubtitle" :label="$t('block.withSubtitle')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-switch v-model="values.withSubtitle"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="subtitleRequired" :label="$t('block.subtitleRequired')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-switch v-model="values.subtitleRequired"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="withDescription" :label="$t('block.withDescription')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-switch v-model="values.withDescription"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="descriptionRequired" :label="$t('block.descriptionRequired')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-switch v-model="values.descriptionRequired"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="withImage" :label="$t('block.withImage')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-switch v-model="values.withImage"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="imageRequired" :label="$t('block.imageRequired')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-switch v-model="values.imageRequired"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="values.withImage">
          <el-form-item prop="imageWidth" :label="$t('block.imageWidth')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-input-number v-model="values.imageWidth" :min="0" :max="65535"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="values.withImage">
          <el-form-item prop="imageHeight" :label="$t('block.imageHeight')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-input-number v-model="values.imageHeight" :min="0" :max="65535"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="withMobileImage" :label="$t('block.withMobileImage')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-switch v-model="values.withMobileImage"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="mobileImageRequired" :label="$t('block.mobileImageRequired')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-switch v-model="values.mobileImageRequired"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="values.withMobileImage">
          <el-form-item prop="mobileImageWidth" :label="$t('block.mobileImageWidth')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-input-number v-model="values.mobileImageWidth" :min="16" :max="65535"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="values.withMobileImage">
          <el-form-item prop="mobileImageHeight" :label="$t('block.mobileImageHeight')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-input-number v-model="values.mobileImageHeight" :min="16" :max="65535"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="enabled" :label="$t('block.enabled')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-switch v-model="values.enabled"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="recommendable" :rules="{ required: true, message: () => $t('v.required') }">
            <template #label><label-tip message="block.recommendable"></label-tip></template>
            <el-switch v-model="values.recommendable"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
    </template>
  </dialog-form>
</template>

<script lang="ts">
export default { name: 'BlockForm' };
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { queryBlock, createBlock, updateBlock, deleteBlock, blockAliasExist, blockScopeNotAllowed } from '@/api/config';
import DialogForm from '@/components/DialogForm.vue';
import LabelTip from '@/components/LabelTip.vue';

defineProps({ modelValue: { type: Boolean, required: true }, beanId: { required: true }, beanIds: { type: Array, required: true } });
defineEmits({ 'update:modelValue': null, finished: null });
const focus = ref<any>();
const values = ref<any>({});
</script>
