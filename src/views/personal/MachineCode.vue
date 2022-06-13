<template>
  <el-dialog :title="$t('menu.personal.machine.code')" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" :width="820" top="5vh">
    <!-- <pre><code class="whitespace-pre-wrap">{{ machineCode }}</code></pre> -->
    <el-input :model-value="machineCode" autosize :readonly="true" v-loading="loading" type="textarea" />
  </el-dialog>
</template>

<script lang="ts">
export default { name: 'MachineCode' };
</script>

<script setup lang="ts">
import { toRefs, watch, ref } from 'vue';
import { queryMachineCode } from '@/api/personal';

const props = defineProps({ modelValue: { type: Boolean, required: true } });
const { modelValue: visible } = toRefs(props);
const loading = ref<boolean>(false);
const machineCode = ref<string>();
const unwatch = watch(visible, async () => {
  if (visible.value) {
    loading.value = true;
    try {
      machineCode.value = await queryMachineCode();
    } finally {
      loading.value = false;
      unwatch();
    }
  }
});
</script>
