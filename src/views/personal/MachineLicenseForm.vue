<template>
  <el-dialog :title="$t('menu.personal.machine.license')" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <el-form :model="values" label-width="150px" label-position="right">
      <el-form-item :label="$t('license.activated')">
        <el-tag v-if="values.activated" type="success">{{ $t('license.activated.true') }}</el-tag>
        <el-tag v-else type="danger">{{ $t('license.activated.false') }}</el-tag>
      </el-form-item>
      <el-form-item v-if="!values.activated" :label="$t('license.reason')">
        <el-tag type="warning">{{ $t('license.status.' + values.status) }}</el-tag>
      </el-form-item>
      <el-form-item :label="$t('license.domains')">
        <el-input :model-value="values.domains.join(', ')" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('license.names')">
        <el-input :model-value="values.names.join(', ')" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('license.expires')">
        <el-input :model-value="values.expires ? dayjs(values.expires).format('YYYY-MM-DD') : $t('values.expires.never')" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('license.limit')">
        <el-input :model-value="values.limit === 0 ? $t('license.limit.0') : values.limit" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('license.version')">
        <el-input :model-value="'V' + values.version" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('license.rank')">
        <el-input :model-value="'R' + values.rank" :readonly="true"></el-input>
      </el-form-item>
      <!--
      <el-form-item :label="$t('license.subjectName')">
        <el-input :model-value="values.subjectName" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('license.subjectCode')">
        <el-input :model-value="values.subjectCode" :readonly="true"></el-input>
      </el-form-item>
       -->
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { getMachineLicense } from '@/api/personal';

defineProps({ modelValue: { type: Boolean, required: true } });
defineEmits({ 'update:modelValue': null });
const values = ref<any>({});
onMounted(async () => {
  values.value = await getMachineLicense();
});
</script>
