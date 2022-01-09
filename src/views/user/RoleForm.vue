<template>
  <dialog-form
    ref="form"
    :name="$t('menu.user.role')"
    :queryBean="queryRole"
    :createBean="createRole"
    :updateBean="updateRole"
    :deleteBean="deleteRole"
    :beanId="beanId"
    :beanIds="beanIds"
    :focus="focus"
    :initValues="(bean) => ({})"
    :toValues="(bean) => ({ ...bean })"
    :disableDelete="(bean) => bean.id <= 1"
    perms="role"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @finished="$emit('finished')"
    @beanChange="(bean) => tree?.setCheckedKeys(bean.permission?.split(',') ?? [])"
    @beforeSubmit="
      (values) =>
        (values.permission = [...tree.getHalfCheckedNodes(), ...tree.getCheckedNodes()]
          .filter((item) => item.perms)
          .map((item) => item.perms?.join(','))
          .join(','))
    "
  >
    <template #default="{values}">
      <el-form-item prop="name" :label="$t('role.name')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.name" ref="focus" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="description" :label="$t('role.description')">
        <el-input v-model="values.description" maxlength="255"></el-input>
      </el-form-item>
      <el-form-item prop="permission" :label="$t('role.permission')">
        <el-tree ref="tree" :data="perms" node-key="key" @check="form.setUnsaved(true)" show-checkbox default-expand-all check-on-click-node />
      </el-form-item>
    </template>
  </dialog-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { queryRole, createRole, updateRole, deleteRole } from '@/api/user';
import { getPermsTreeData } from '@/data';
import DialogForm from '@/components/DialogForm.vue';

export default defineComponent({
  components: { DialogForm },
  props: { modelValue: { type: Boolean, required: true }, beanId: { required: true }, beanIds: { required: true } },
  emits: { 'update:modelValue': null, finished: null },
  setup() {
    const focus = ref<any>(null);
    const tree = ref<any>(null);
    const form = ref<any>(null);
    const perms = getPermsTreeData();
    return { queryRole, createRole, updateRole, deleteRole, focus, form, tree, perms };
  },
});
</script>
