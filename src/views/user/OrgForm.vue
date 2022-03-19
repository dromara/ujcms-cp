<template>
  <dialog-form
    :name="$t('menu.user.org')"
    :queryBean="queryOrg"
    :createBean="createOrg"
    :updateBean="updateOrg"
    :deleteBean="deleteOrg"
    :beanId="beanId"
    :beanIds="beanIds"
    :focus="focus"
    :initValues="(bean) => ({ parentId: bean?.parentId ?? parentId })"
    :toValues="(bean) => ({ ...bean })"
    :disableDelete="(bean) => bean.id <= 1"
    perms="org"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @finished="finished"
    @beanChange="fetchOrgList"
  >
    <template #default="{ values, isEdit }">
      <el-form-item v-if="!isEdit || values.id > 1" prop="parentId" :label="$t('org.parent')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-cascader
          v-model="values.parentId"
          :options="orgList"
          :props="{ value: 'id', label: 'name', checkStrictly: true }"
          @change="(value) => (values.parentId = value[value.length - 1])"
          class="w-full"
        ></el-cascader>
      </el-form-item>
      <el-form-item prop="name" :label="$t('org.name')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.name" ref="focus" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="address" :label="$t('org.address')"><el-input v-model="values.address" maxlength="255"></el-input></el-form-item>
      <el-form-item prop="phone" :label="$t('org.phone')"><el-input v-model="values.phone" maxlength="100"></el-input></el-form-item>
      <el-form-item prop="contacts" :label="$t('org.contacts')"><el-input v-model="values.contacts" maxlength="100"></el-input></el-form-item>
    </template>
  </dialog-form>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted, ref } from 'vue';
import { queryOrg, createOrg, updateOrg, deleteOrg, queryOrgList } from '@/api/user';
import { toTree, disableSubtree } from '@/utils/tree';
import DialogForm from '@/components/DialogForm.vue';

defineProps({
  modelValue: { type: Boolean, required: true },
  beanId: { required: true },
  beanIds: { type: Array, required: true },
  parentId: { type: Number, required: true },
});
const emit = defineEmits({ 'update:modelValue': null, finished: null });
const focus = ref<any>();
const orgList = ref<any[]>([]);
const fetchOrgList = async (bean?: any) => {
  orgList.value = disableSubtree(toTree(await queryOrgList()), bean?.id);
};
const finished = async (bean?: any) => {
  await fetchOrgList(bean);
  emit('finished');
};
onMounted(() => {
  fetchOrgList();
});
</script>
