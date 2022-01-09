<template>
  <dialog-form
    :name="$t('menu.system.storage')"
    :queryBean="queryStorage"
    :createBean="createStorage"
    :updateBean="updateStorage"
    :deleteBean="deleteStorage"
    :beanId="beanId"
    :beanIds="beanIds"
    :focus="focus"
    :initValues="(bean) => ({ scope: 0, type: 1, mode: 0 })"
    :toValues="(bean) => ({ ...bean })"
    perms="storage"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @finished="$emit('finished')"
  >
    <template #default="{values}">
      <el-form-item prop="name" :label="$t('storage.name')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.name" ref="focus" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="description" :label="$t('storage.description')">
        <el-input v-model="values.description" maxlength="255"></el-input>
      </el-form-item>
      <el-form-item prop="scope" :label="$t('storage.scope')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-radio-group v-model="values.scope">
          <el-radio v-for="n in [0, 1, 2]" :key="n" :label="n">{{ $t(`storage.scope.${n}`) }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="type" :label="$t('storage.type')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-radio-group v-model="values.type">
          <el-radio v-for="n in [1, 2]" :key="n" :label="n">{{ $t(`storage.type.${n}`) }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="mode" :label="$t('storage.mode')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-select v-model="values.mode">
          <el-option v-for="n in [0]" :key="n" :value="n" :label="$t(`storage.mode.${n}`)" />
          <!-- <el-option v-for="n in [0, 1, 2, 3, 4, 5]" :key="n" :value="n" :label="$t(`storage.mode.${n}`)" /> -->
        </el-select>
      </el-form-item>
      <el-form-item prop="path" :label="$t('storage.path')">
        <el-input v-model="values.path" maxlength="255"></el-input>
      </el-form-item>
      <el-form-item prop="url" :label="$t('storage.url')">
        <el-input v-model="values.url" maxlength="255"></el-input>
      </el-form-item>
    </template>
  </dialog-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { queryStorage, createStorage, updateStorage, deleteStorage } from '@/api/system';
import DialogForm from '@/components/DialogForm.vue';

export default defineComponent({
  components: { DialogForm },
  props: { modelValue: { type: Boolean, required: true }, beanId: { required: true }, beanIds: { required: true } },
  emits: { 'update:modelValue': null, finished: null },
  setup() {
    const focus = ref<any>(null);
    return { queryStorage, createStorage, updateStorage, deleteStorage, focus };
  },
});
</script>
