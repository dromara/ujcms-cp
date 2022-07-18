<template>
  <dialog-form
    :name="$t('menu.content.dict')"
    :queryBean="queryDict"
    :createBean="createDict"
    :updateBean="updateDict"
    :deleteBean="deleteDict"
    :beanId="beanId"
    :beanIds="beanIds"
    :focus="focus"
    :initValues="(): any => ({ typeId: type?.id, enabled: true })"
    :toValues="(bean) => ({ ...bean })"
    :disableDelete="(bean: any) => !deletable(bean)"
    perms="dict"
    v-model:values="values"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @finished="$emit('finished')"
  >
    <template #default="{ isEdit }">
      <el-form-item prop="typeId" :label="$t('dict.type')">
        <el-select v-model="values.typeId" disabled>
          <el-option :value="type.id" :label="type.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" :label="$t('dict.name')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.name" ref="focus" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="value" :label="$t('dict.value')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.value" :disabled="isEdit && !deletable(values)" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="remark" :label="$t('dict.remark')">
        <el-input v-model="values.remark" type="textarea" :rows="2" maxlength="255"></el-input>
      </el-form-item>
      <el-form-item prop="sys" :label="$t('dict.sys')">
        <el-switch v-model="values.sys" disabled></el-switch>
      </el-form-item>
      <el-form-item prop="enabled" :label="$t('dict.enabled')">
        <el-switch v-model="values.enabled" :disabled="isEdit && !deletable(values)"></el-switch>
      </el-form-item>
    </template>
  </dialog-form>
</template>

<script lang="ts">
export default { name: 'DictForm' };
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { queryDict, createDict, updateDict, deleteDict } from '@/api/content';
import DialogForm from '@/components/DialogForm.vue';

defineProps({ modelValue: { type: Boolean, required: true }, beanId: { required: true }, beanIds: { type: Array, required: true }, type: null });
defineEmits({ 'update:modelValue': null, finished: null });
const focus = ref<any>();
const values = ref<any>({});
const deletable = (bean: any) => bean.id >= 500;
</script>
