<template>
  <dialog-form
    :name="$t('menu.config.model')"
    :queryBean="queryModel"
    :createBean="createModel"
    :updateBean="updateModel"
    :deleteBean="deleteModel"
    :beanId="beanId"
    :beanIds="beanIds"
    :focus="focus"
    :initValues="(): any => ({ type: modelType, scope: 0 })"
    :toValues="(bean) => ({ ...bean })"
    :disableDelete="(bean) => bean.id <= 10"
    perms="model"
    v-model:values="values"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @finished="$emit('finished')"
  >
    <template #default="{}">
      <el-form-item prop="name" :label="$t('model.name')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.name" ref="focus" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="scope" :label="$t('model.scope')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-radio-group v-model="values.scope" :disabled="values.id < 10">
          <el-radio v-for="n in [0, 2]" :key="n" :label="n">{{ $t(`model.scope.${n}`) }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="type" :label="$t('model.type')">
        <el-select v-model="values.type" disabled>
          <el-option :value="modelType" :label="$t(`model.type.${modelType}`)"></el-option>
        </el-select>
      </el-form-item>
    </template>
  </dialog-form>
</template>

<script lang="ts">
export default { name: 'ModelForm' };
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { queryModel, createModel, updateModel, deleteModel } from '@/api/config';
import DialogForm from '@/components/DialogForm.vue';

defineProps({
  modelValue: { type: Boolean, required: true },
  beanId: { required: true },
  beanIds: { type: Array, required: true },
  modelType: { type: String, required: true },
});
defineEmits({ 'update:modelValue': null, finished: null });
const focus = ref<any>();
const values = ref<any>({});
</script>
