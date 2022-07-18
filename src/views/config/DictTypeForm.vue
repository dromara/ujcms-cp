<template>
  <dialog-form
    :name="$t('menu.config.dictType')"
    :queryBean="queryDictType"
    :createBean="createDictType"
    :updateBean="updateDictType"
    :deleteBean="deleteDictType"
    :beanId="beanId"
    :beanIds="beanIds"
    :focus="focus"
    :initValues="() => ({ scope: 0 })"
    :toValues="(bean) => ({ ...bean })"
    :disableDelete="(bean: any) => !deletable(bean)"
    perms="dictType"
    v-model:values="values"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @finished="$emit('finished')"
  >
    <template #default="{ bean, isEdit }">
      <el-form-item prop="name" :label="$t('dictType.name')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.name" ref="focus" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item
        prop="alias"
        :label="$t('dictType.alias')"
        :rules="[
          { required: true, message: () => $t('v.required') },
          {
            asyncValidator: async (rule: any, value: any, callback: any) => {
              if (value !== bean.alias && (await dictTypeAliasExist(value, values.scope))) {
                callback($t('dictType.error.aliasExist'));
              }
              callback();
            },
          },
        ]"
      >
        <el-input v-model="values.alias" :disabled="isEdit && !deletable(values)" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="remark" :label="$t('dictType.remark')">
        <el-input v-model="values.remark" type="textarea" :rows="2" maxlength="255"></el-input>
      </el-form-item>
      <el-form-item prop="scope" :label="$t('dictType.scope')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-radio-group v-model="values.scope" :disabled="isEdit && !deletable(values)">
          <el-radio v-for="n in [0, 2]" :key="n" :label="n">{{ $t(`dictType.scope.${n}`) }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="sys" :label="$t('dictType.sys')">
        <el-switch v-model="values.sys" disabled></el-switch>
      </el-form-item>
    </template>
  </dialog-form>
</template>

<script lang="ts">
export default { name: 'DictTypeForm' };
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { queryDictType, createDictType, updateDictType, deleteDictType, dictTypeAliasExist } from '@/api/config';
import DialogForm from '@/components/DialogForm.vue';

defineProps({ modelValue: { type: Boolean, required: true }, beanId: { required: true }, beanIds: { type: Array, required: true } });
defineEmits({ 'update:modelValue': null, finished: null });
const focus = ref<any>();
const values = ref<any>({});
const deletable = (bean: any) => bean.id >= 100;
</script>
