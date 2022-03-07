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
    :initValues="() => ({ scope: 0, sys: false })"
    :toValues="(bean) => ({ ...bean })"
    perms="dictType"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @finished="$emit('finished')"
  >
    <template #default="{ values }">
      <el-form-item prop="name" :label="$t('dictType.name')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.name" ref="focus" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="alias" :label="$t('dictType.alias')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.alias" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="remark" :label="$t('dictType.remark')">
        <el-input v-model="values.remark" type="textarea" :rows="2" maxlength="255"></el-input>
      </el-form-item>
      <el-form-item prop="scope" :label="$t('dictType.scope')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-radio-group v-model="values.scope">
          <el-radio v-for="n in [0, 1, 2]" :key="n" :label="n">{{ $t(`dictType.scope.${n}`) }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="sys" :label="$t('dictType.sys')">
        <el-switch v-model="values.sys" disabled></el-switch>
      </el-form-item>
    </template>
  </dialog-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { queryDictType, createDictType, updateDictType, deleteDictType } from '@/api/config';
import DialogForm from '@/components/DialogForm.vue';

export default defineComponent({
  components: { DialogForm },
  props: { modelValue: { type: Boolean, required: true }, beanId: { required: true }, beanIds: { type: Array, required: true } },
  emits: { 'update:modelValue': null, finished: null },
  setup() {
    const focus = ref<any>();
    return { queryDictType, createDictType, updateDictType, deleteDictType, focus };
  },
});
</script>
