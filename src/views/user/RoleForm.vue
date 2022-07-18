<template>
  <dialog-form
    :name="$t('menu.user.role')"
    :queryBean="queryRole"
    :createBean="createRole"
    :updateBean="updateRole"
    :deleteBean="deleteRole"
    :beanId="beanId"
    :beanIds="beanIds"
    :focus="focus"
    :initValues="() => ({ type: 4, rank: currentUser.rank + 1, scope: 0 })"
    :toValues="(bean) => ({ ...bean })"
    :disableDelete="(bean) => bean.id <= 1"
    :disableEdit="(bean) => (bean.global && !currentUser.globalPermission) || currentUser.rank > bean.rank"
    perms="role"
    v-model:values="values"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @finished="$emit('finished')"
  >
    <template #default="{ bean, disabled }">
      <el-form-item prop="name" :label="$t('role.name')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.name" ref="focus" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="description" :label="$t('role.description')">
        <el-input v-model="values.description" maxlength="300"></el-input>
      </el-form-item>
      <el-form-item prop="rank" :rules="[{ required: true, message: () => $t('v.required') }]">
        <template #label><label-tip message="role.rank" help /></template>
        <el-input-number v-model.number="values.rank" :min="disabled ? 0 : currentUser.rank" :max="32767" />
      </el-form-item>
      <el-form-item
        prop="type"
        :rules="[
          { required: true, message: () => $t('v.required') },
          {
            validator: (rule, value, callback) => {
              if ([1, 2, 3].includes(value) && currentUser.epRank < 1) {
                callback($t('error.enterprise.short'));
              }
              callback();
            },
          },
        ]"
      >
        <template #label><label-tip message="role.type" help /></template>
        <el-select v-model="values.type">
          <el-option v-for="item in [1, 2, 3, 4]" :key="item" :label="$t(`role.type.${item}`)" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="scope"
        :label="$t('block.scope')"
        :rules="[
          { required: true, message: () => $t('v.required') },
          {
            asyncValidator: async (rule: any, value: any, callback: any) => {
              if (value !== bean.scope && await roleScopeNotAllowed(values.scope)) {
                callback($t('role.error.scopeNotAllowd'));
              }
              callback();
            },
          },
        ]"
      >
        <el-radio-group v-model="values.scope">
          <el-radio v-for="n in [0, 2]" :key="n" :label="n" :disabled="!currentUser.globalPermission">{{ $t(`role.scope.${n}`) }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </template>
  </dialog-form>
</template>

<script lang="ts">
export default { name: 'RoleForm' };
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { queryRole, createRole, updateRole, deleteRole, roleScopeNotAllowed } from '@/api/user';
import { currentUser } from '@/store/useCurrentUser';
import DialogForm from '@/components/DialogForm.vue';
import LabelTip from '@/components/LabelTip.vue';

defineProps({ modelValue: { type: Boolean, required: true }, beanId: { required: true }, beanIds: { type: Array, required: true } });
defineEmits({ 'update:modelValue': null, finished: null });

const focus = ref<any>();
const values = ref<any>({});
</script>
