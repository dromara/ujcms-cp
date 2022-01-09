<template>
  <dialog-form
    :name="$t('menu.config.dict')"
    :queryBean="queryDict"
    :createBean="createDict"
    :updateBean="updateDict"
    :deleteBean="deleteDict"
    :beanId="beanId"
    :beanIds="beanIds"
    :focus="focus"
    :initValues="(bean) => ({ typeId: type?.id, enabled: true })"
    :toValues="(bean) => ({ ...bean })"
    perms="dict"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @finished="$emit('finished')"
  >
    <template #default="{values}">
      <el-form-item prop="typeId" :label="$t('dict.type')">
        <el-select v-model="values.typeId" disabled>
          <el-option :value="type.id" :label="type.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" :label="$t('dict.name')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.name" ref="focus" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="value" :label="$t('dict.value')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.value" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="remark" :label="$t('dict.remark')">
        <el-input v-model="values.remark" type="textarea" :rows="2" maxlength="255"></el-input>
      </el-form-item>
      <el-form-item prop="enabled" :label="$t('dict.enabled')">
        <el-switch v-model="values.enabled"></el-switch>
      </el-form-item>
    </template>
  </dialog-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { queryDict, createDict, updateDict, deleteDict } from '@/api/config';
import DialogForm from '@/components/DialogForm.vue';

export default defineComponent({
  components: { DialogForm },
  props: { modelValue: { type: Boolean, required: true }, beanId: { required: true }, beanIds: { required: true }, type: null },
  emits: { 'update:modelValue': null, finished: null },
  setup() {
    const focus = ref<any>(null);
    return { queryDict, createDict, updateDict, deleteDict, focus };
  },
});
</script>
