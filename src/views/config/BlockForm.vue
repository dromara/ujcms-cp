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
    :initValues="
      (bean) => ({ scope: 0, withImage: false, imageWidth: 300, imageHeight: 200, mobileImageWidth: 300, mobileImageHeight: 200, withMobileImage: false, enabled: true })
    "
    :toValues="(bean) => ({ ...bean })"
    perms="block"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @finished="$emit('finished')"
  >
    <template #default="{values}">
      <el-form-item prop="name" :label="$t('block.name')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.name" ref="focus" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="alias" :label="$t('block.alias')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.alias" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="scope" :label="$t('block.scope')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-radio-group v-model="values.scope">
          <el-radio v-for="n in [0, 2]" :key="n" :label="n">{{ $t(`block.scope.${n}`) }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="withDescription" :label="$t('block.withDescription')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-switch v-model="values.withDescription"></el-switch>
      </el-form-item>
      <el-form-item prop="withImage" :label="$t('block.withImage')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-switch v-model="values.withImage"></el-switch>
      </el-form-item>
      <el-form-item v-if="values.withImage" prop="imageWidth" :label="$t('block.imageWidth')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input-number v-model="values.imageWidth" :min="0" :max="65535"></el-input-number>
      </el-form-item>
      <el-form-item v-if="values.withImage" prop="imageHeight" :label="$t('block.imageHeight')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input-number v-model="values.imageHeight" :min="0" :max="65535"></el-input-number>
      </el-form-item>
      <el-form-item prop="withMobileImage" :label="$t('block.withMobileImage')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-switch v-model="values.withMobileImage"></el-switch>
      </el-form-item>
      <el-form-item v-if="values.withMobileImage" prop="mobileImageWidth" :label="$t('block.mobileImageWidth')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input-number v-model="values.mobileImageWidth" :min="16" :max="65535"></el-input-number>
      </el-form-item>
      <el-form-item v-if="values.withMobileImage" prop="mobileImageHeight" :label="$t('block.mobileImageHeight')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input-number v-model="values.mobileImageHeight" :min="16" :max="65535"></el-input-number>
      </el-form-item>
      <el-form-item prop="enabled" :label="$t('block.enabled')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-switch v-model="values.enabled"></el-switch>
      </el-form-item>
    </template>
  </dialog-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { queryBlock, createBlock, updateBlock, deleteBlock } from '@/api/config';
import DialogForm from '@/components/DialogForm.vue';

export default defineComponent({
  components: { DialogForm },
  props: { modelValue: { type: Boolean, required: true }, beanId: { required: true }, beanIds: { type: Array, required: true } },
  emits: { 'update:modelValue': null, finished: null },
  setup() {
    const focus = ref<any>();
    return { queryBlock, createBlock, updateBlock, deleteBlock, focus };
  },
});
</script>
