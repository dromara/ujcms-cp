<template>
  <el-dialog :title="$t('menu.personal.homepage.environment')" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" :width="768" top="5vh">
    <el-form :model="values" v-loading="loading" label-width="150px" label-position="right">
      <el-form-item :label="title + $t('environment.version')">
        <el-input :value="values.version" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('environment.os')">
        <el-input :value="[values.osName, values.osArch, values.osVersion].join(', ')" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('environment.java')">
        <el-input :value="[values.javaRuntimeName, values.javaRuntimeVersion, values.javaVendor].join(', ')" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('environment.javaVm')">
        <el-input :value="[values.javaVmName, values.javaVmVersion, values.javaVmVendor].join(', ')" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('environment.userName')">
        <el-input :value="values.userName" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('environment.userDir')">
        <el-input :value="values.userDir" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('environment.javaIoTmpdir')">
        <el-input :value="values.javaIoTmpdir" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('environment.maxMemory')">
        <el-input :value="$n(values.maxMemory ?? 0, 'decimal')" :readonly="true"><template #append>MB</template></el-input>
      </el-form-item>
      <el-form-item :label="$t('environment.totalMemory')">
        <el-input :value="$n(values.totalMemory ?? 0, 'decimal')" :readonly="true"><template #append>MB</template></el-input>
      </el-form-item>
      <el-form-item :label="$t('environment.usedMemory')">
        <el-input :value="$n(values.usedMemory ?? 0, 'decimal')" :readonly="true"><template #append>MB</template></el-input>
      </el-form-item>
      <el-form-item :label="$t('environment.freeMemory')">
        <el-input :value="$n(values.freeMemory ?? 0, 'decimal')" :readonly="true"><template #append>MB</template></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('environment.availableMemory')">
        <el-input :value="$n(values.availableMemory ?? 0, 'decimal')" :readonly="true"><template #append>MB</template></el-input>
      </el-form-item> -->
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
export default { name: 'HomepageEnvironment' };
</script>

<script setup lang="ts">
import { toRefs, watch, ref } from 'vue';
import { queryHomepageEnvironment } from '@/api/personal';

const props = defineProps({ modelValue: { type: Boolean, required: true } });
defineEmits({ 'update:modelValue': null });

const { modelValue: visible } = toRefs(props);
const loading = ref<boolean>(false);
const values = ref<any>({});
const title = import.meta.env.VITE_APP_TITLE || 'UJCMS';
watch(visible, async () => {
  if (visible.value) {
    loading.value = true;
    try {
      values.value = await queryHomepageEnvironment();
    } finally {
      loading.value = false;
    }
  }
});
</script>
