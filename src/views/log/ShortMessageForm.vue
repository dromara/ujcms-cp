<template>
  <dialog-form
    :name="$t('menu.log.shortMessage')"
    :queryBean="queryShortMessage"
    :createBean="createShortMessage"
    :updateBean="updateShortMessage"
    :deleteBean="deleteShortMessage"
    :beanId="beanId"
    :beanIds="beanIds"
    :focus="focus"
    :initValues="(): any => ({})"
    :toValues="(bean) => ({ ...bean })"
    perms="shortMessage"
    :disableEdit="() => true"
    v-model:values="values"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @finished="$emit('finished')"
    :addable="false"
  >
    <template #default="{ bean }">
      <el-form-item prop="type">
        <template #label><label-tip message="shortMessage.type" /></template>
        <el-tag v-if="values.type === 1">{{ $t(`shortMessage.type.${values.type}`) }}</el-tag>
        <el-tag v-else-if="values.type" type="success">{{ $t(`shortMessage.type.${values.type}`) }}</el-tag>
      </el-form-item>
      <el-form-item prop="receiver">
        <template #label><label-tip message="shortMessage.receiver" /></template>
        <el-input :model-value="values.receiver"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <template #label><label-tip message="shortMessage.code" /></template>
        <el-input :model-value="values.code"></el-input>
      </el-form-item>
      <el-form-item prop="sendDate" :label="$t('shortMessage.sendDate')">
        <el-date-picker :model-value="values.sendDate" type="datetime"></el-date-picker>
      </el-form-item>
      <el-form-item prop="attempts" :label="$t('shortMessage.attempts')">
        <el-input :model-value="values.attempts"></el-input>
      </el-form-item>
      <el-form-item prop="usage">
        <template #label><label-tip message="shortMessage.usage" /></template>
        <el-tag v-if="values.type != null">{{ $t(`shortMessage.usage.${values.type}`) }}</el-tag>
      </el-form-item>
      <el-form-item prop="status">
        <template #label><label-tip message="shortMessage.status" /></template>
        <el-tag v-if="values.status === 1" type="success">{{ $t(`shortMessage.status.${values.status}`) }}</el-tag>
        <el-tag v-else-if="[2, 3].includes(values.status)" type="danger">{{ $t(`shortMessage.status.${values.status}`) }}</el-tag>
        <el-tag v-else-if="[4].includes(values.status)" type="warning">{{ $t(`shortMessage.status.${values.status}`) }}</el-tag>
        <el-tag v-else-if="values.status != null" type="info">{{ $t(`shortMessage.status.${values.status}`) }}</el-tag>
      </el-form-item>
    </template>
  </dialog-form>
</template>

<script lang="ts">
export default { name: 'ShortMessageForm' };
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { queryShortMessage, createShortMessage, updateShortMessage, deleteShortMessage } from '@/api/log';
import DialogForm from '@/components/DialogForm.vue';
import LabelTip from '@/components/LabelTip.vue';

defineProps({ modelValue: { type: Boolean, required: true }, beanId: { required: true }, beanIds: { type: Array, required: true } });
defineEmits({ 'update:modelValue': null, finished: null });
const focus = ref<any>();
const values = ref<any>({});
</script>
