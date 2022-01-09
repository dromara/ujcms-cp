<template>
  <dialog-form
    :name="$t('menu.user.group')"
    :queryBean="queryGroup"
    :createBean="createGroup"
    :updateBean="updateGroup"
    :deleteBean="deleteGroup"
    :beanId="beanId"
    :beanIds="beanIds"
    :focus="focus"
    :initValues="(bean) => ({ type: 2 })"
    :toValues="(bean) => ({ ...bean })"
    :disableDelete="(bean) => bean.id <= 10"
    perms="group"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @finished="$emit('finished')"
  >
    <template #default="{values}">
      <el-form-item prop="name" :label="$t('group.name')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.name" ref="focus" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="description" :label="$t('group.description')">
        <el-input v-model="values.description" maxlength="255"></el-input>
      </el-form-item>
      <el-form-item prop="type" :label="$t('group.type')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-select v-model="values.type" :disabled="values.type === 1">
          <el-option v-for="n in [1, 2]" :key="n" :disabled="n === 1" :label="$t(`group.type.${n}`)" :value="n"></el-option>
        </el-select>
      </el-form-item>
    </template>
  </dialog-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { queryGroup, createGroup, updateGroup, deleteGroup } from '@/api/user';
import DialogForm from '@/components/DialogForm.vue';

export default defineComponent({
  components: { DialogForm },
  props: { modelValue: { type: Boolean, required: true }, beanId: { required: true }, beanIds: { required: true } },
  emits: { 'update:modelValue': null, finished: null },
  setup() {
    const focus = ref<any>(null);
    return { queryGroup, createGroup, updateGroup, deleteGroup, focus };
  },
});
</script>
